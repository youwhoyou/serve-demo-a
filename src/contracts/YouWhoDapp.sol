// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../node_modules/@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./YouWho.sol";

// interface YouWhoInterface {
//     function mint(address to, uint256 amount) external payable;
// }

contract YouWhoDapp is     
    Context,
    AccessControlEnumerable {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TOKEN_ROLE = keccak256("TOKEN_ROLE");
    bytes32 public constant STAKING_ROLE = keccak256("STAKING_ROLE");

    // another way of instantiating IERC20 : IERC20 public token; then assigning a token address: token = IERC20(address tokenAddress);
    // YouWhoInterface YouWhoInstance = YouWhoInterface(tokenMapping[bytes32("YOU")].tokenAddress);
    YouWho private youToken;
    AggregatorV3Interface internal priceFeed;

    event PaymentDone(address indexed user, address indexed provider, bytes32 booking, uint amount, bytes32 ticker, uint amountYou, uint rating, uint fee);
    event DepositStake(address indexed user, uint youAmount, uint timeStart);
    event WithdrawStake(address indexed user, uint youAmount, uint depositTime, uint interest);
    event ReviewedUser(address indexed provider, bytes32 booking, uint rating, uint amountYou);

    struct Token {
        address tokenAddress;
        address oracleAddress;
        uint manualTokenPrice;
        uint manualOracleDecimals;
    }

    mapping(address => bool) public isDeposited;
    mapping(address => uint) public depositStart;
    mapping(address => uint) public youBalanceOf;
    mapping(bytes32 => address) public claimableAddress;
    mapping(bytes32 => uint) public claimableAmount;
    mapping(bytes32 => Token) public tokenMapping;

    bytes32[] public tokenList;
    uint public fee_; // percentage as an integer, ie, input 3 for 3% fee. divide by 10000
    address public feeCollector_; // address which payment fees are sent to
    uint public interest_; // staking interest per annum, input as integer, ie, input 10 for 10% pa.
    uint public youBack_; // amount of you returned as a % of USD value of payment, ie, input 10 for 10% back
    uint public minStakeTime_; // minimum amount of time to stake before being able to withdraw, in seconds
    uint public providerYouRatio_; // the amount to divide the users you rewards by, eg if 10% of user rewards then set to 100/10 = 10, if 50% then 100/50 = 2
    bool[] public switches_; // switches for various functions
    

    constructor(address _you, YouWho you_, address _youusd) {

        youToken = you_;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
        _setupRole(TOKEN_ROLE, _msgSender());
        _setupRole(STAKING_ROLE, _msgSender());

        fee_ = 300; // 3% of every payment goes to owner, divide by 10000
        feeCollector_ =  address(this); // address which payment fees are sent to, set to contract address at beggining
        youBack_ = 1000; // 10% of each payment USD amount, you is minted to user, divide by 10000
        providerYouRatio_ = 1000; // 100/ratio, eg, 100/1000 means provider will get 10% you that user gets, so if user get 300 provider will get 30
        minStakeTime_ = 60; // 10 seconds just to test, use 86400 seconds for 24hrs
        interest_ = 1000; // 10% pa staking interest, divide by 10000
        switches_ = [ true, true, true, true ];


        // set chainlink address to 0 for now
        bytes32 tickerYou = bytes32("YOU");
        tokenMapping[tickerYou] = Token(_you, address(0), 0.001 * (10**18), 18);
        tokenList.push(tickerYou);
        

        // // ganache ETH / USD
        // bytes32 tickerEth = bytes32("ETH");
        // tokenMapping[tickerEth] = Token(address(this), address(0), 2000 * (10**8), 8);
        // tokenList.push(tickerEth);

        // // ganache mock USDC / USD
        // bytes32 tickerYouusd = bytes32("YOUUSD");
        // tokenMapping[tickerYouusd] = Token(0xf572bb43CE1653A398950f31c5DCe6c47fA66012, address(0), 1 * (10**8), 8);
        // tokenList.push(tickerYouusd);


        // avalanche fuji AVAX / USD
        bytes32 tickerAvax = bytes32("ETH"); // actually AVAX
        tokenMapping[tickerAvax] = Token(address(this), 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD, 61.24 * (10**8), 8);
        tokenList.push(tickerAvax);

        // avalanche fuji USDT / USD
        bytes32 tickerYouusd = bytes32("YOUUSD");
        tokenMapping[tickerYouusd] = Token(_youusd, 0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad, 1 * (10**8), 8);
        tokenList.push(tickerYouusd);


        // // rinkeby ETH / USD
        // bytes32 tickerEth = bytes32("ETH");
        // tokenMapping[tickerEth] = Token(address(this), 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e, 2000 * (10**8), 8);
        // tokenList.push(tickerEth);

        // // rinkeby mock USDC / USD
        // bytes32 tickerYouusd = bytes32("YOUUSD");
        // tokenMapping[tickerYouusd] = Token(0x7c875FCdf6728E16c51CFC542341110A9DD469cC, 0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB, 1 * (10**8), 8);
        // tokenList.push(tickerYouusd);


        // // mainnet ETH / USD
        // bytes32 tickerEth = bytes32("ETH");
        // tokenMapping[tickerEth] = Token(address(this), 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419, 2000 * (10**8), 8);
        // tokenList.push(tickerEth);

        // // mainnet SUSD / USD
        // bytes32 tickerSusd = bytes32("SUSD");
        // tokenMapping[tickerSusd] = Token(0x57Ab1ec28D129707052df4dF418D58a2D46d5f51, 0xad35Bd71b9aFE6e4bDc266B345c198eaDEf9Ad94, 1 * (10**8), 8);
        // tokenList.push(tickerSusd);

        // // mainnet DAI / USD
        // bytes32 tickerDai = bytes32("DAI");
        // tokenMapping[tickerDai] = Token(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9, 1 * (10**8), 8);
        // tokenList.push(tickerDai);

        // // mainnet USDC / USD
        // bytes32 tickerUsdc = bytes32("USDC");
        // tokenMapping[tickerUsdc] = Token(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6, 1 * (10**8), 8);
        // tokenList.push(tickerUsdc);

        // // mainnet USDT / USD
        // bytes32 tickerUsdt = bytes32("USDT");
        // tokenMapping[tickerUsdt] = Token(0xdAC17F958D2ee523a2206206994597C13D831ec7, 0x3E7d1eAB13ad0104d2750B8863b489D65364e32D, 1 * (10**8), 8);
        // tokenList.push(tickerUsdt);

    }

    modifier tokenExists(bytes32 ticker) {
        require(tokenMapping[ticker].tokenAddress != address(0),"Token does not exist");
        _;
    }

    // this function is for future proofing incase more ERC20 tokens need to be added
    function addToken(bytes32 _ticker, address _tokenAddress, address _oracleAddress, uint _manualTokenPrice, uint _manualOracleDecimals ) external {
        require(hasRole(TOKEN_ROLE, _msgSender()),"Error: You must have token role to add tokens.");
        tokenMapping[_ticker] = Token(_tokenAddress, _oracleAddress, _manualTokenPrice, _manualOracleDecimals);
        tokenList.push(_ticker);
    }

    // this function is for future proofing, for when token address and/or oracle address changes
    function editToken(bytes32 _ticker, address _tokenAddress, address _oracleAddress, uint _manualTokenPrice, uint _manualOracleDecimals ) external tokenExists(_ticker) {
        require(hasRole(TOKEN_ROLE, _msgSender()),"Error: You must have token role to edit tokens.");
        tokenMapping[_ticker].tokenAddress = _tokenAddress;
        tokenMapping[_ticker].oracleAddress = _oracleAddress;
        tokenMapping[_ticker].manualTokenPrice = _manualTokenPrice;
        tokenMapping[_ticker].manualOracleDecimals = _manualOracleDecimals;
    }

    // function to change fee of the YouWho payment network, newFee should be an integer, eg input 3 for 3% fee per payment transaction
    function changeFee(uint newValue) external {
        require(hasRole(ADMIN_ROLE, _msgSender()),"Error: You must have admin role to edit fee.");
        fee_ = newValue;
    }

    // function to change feeCollector address of the YouWho payment network
    function changeFeeCollector(address newValue) external {
        require(hasRole(ADMIN_ROLE, _msgSender()),"Error: You must have admin role to edit collector address.");
        feeCollector_ = newValue;
    }

    // function to change amount of YOU the user gets back for each payment
    function changeYouBack(uint newValue) external {
        require(hasRole(ADMIN_ROLE, _msgSender()),"Error: You must have admin role to edit user YOU rewards.");
        youBack_ = newValue;
    }

    // function to change the amount of YOU the provider gets back when reviewing the user, if 10 then the provider gets 1/10 of YOU the user got
    function changeProviderYouRatio(uint newValue) external {
        require(hasRole(ADMIN_ROLE, _msgSender()),"Error: You must have admin role to edit provider YOU rewards.");
        providerYouRatio_ = newValue;
    }

    // function to change the minimum YOU staking time in seconds, 1 day = 86400 seconds
    function changeMinStakeTime(uint newValue) external {
        require(hasRole(STAKING_ROLE, _msgSender()),"Error: You must have staking role to edit min. stake.");
        minStakeTime_ = newValue;
    }

    // function to change yearly interest rate of you staking, newInterest should be an integer, eg input 10 for 10% interest pa
    function changeInterest(uint newValue) external {
        require(hasRole(STAKING_ROLE, _msgSender()),"Error: You must have staking role to edit % apy.");
        interest_ = newValue;
    }

    // switches to turn various functions on and off
    function changeSwitches(bool payEth, bool payToken, bool deposit, bool review) external {
        require(hasRole(ADMIN_ROLE, _msgSender()),"Error: You must have admin role to edit function switches.");
        switches_ = [ payEth, payToken, deposit, review ];
    }

    // payment router, % fee will go to contract owner
    // for Eth payments, transfer value: ether to this function and it will route it to provider and owner
    function makePaymentEth(address provider, bytes32 booking, uint rating) public payable {

        if (switches_[0]) {

            require(msg.value > 1000000000000, "Payment must have a value over 1000 Gwei");
            require(msg.sender != provider, "Can not transfer payment to yourself");
            require(rating > 0 && rating <= 50, "Error, rating must be between 1 & 5");

            uint amountToOwner = msg.value * fee_ / 10000;
            uint amountToProvider = msg.value - amountToOwner;

            payable(feeCollector_).transfer(amountToOwner);
            payable(provider).transfer(amountToProvider);

            uint amountYou;
            
            if (youBack_ != 0) {

                if (tokenMapping[bytes32("ETH")].oracleAddress != address(0)) {
                    priceFeed = AggregatorV3Interface(tokenMapping[bytes32("ETH")].oracleAddress);
                    (, int price, , , ) = priceFeed.latestRoundData();
                    (uint8 decimals) = priceFeed.decimals();

                    amountYou = msg.value * uint(price) / (10 ** uint(decimals)) * youBack_ / 10000; 
                    youToken.mint(msg.sender,amountYou);

                } else {
                    amountYou = msg.value * tokenMapping[bytes32("ETH")].manualTokenPrice / (10 ** tokenMapping[bytes32("ETH")].manualOracleDecimals) * youBack_ / 10000; 
                    youToken.mint(msg.sender,amountYou);
                }

                claimableAmount[booking] = amountYou * 100 / providerYouRatio_;
                claimableAddress[booking] = provider;

            } 

            emit PaymentDone(msg.sender, provider, booking, msg.value, bytes32("ETH"), amountYou, rating, fee_);

        }
    }

    // for ERC20 payments
    function makePayment(address provider, bytes32 booking, uint amount, bytes32 ticker, uint rating) public tokenExists(ticker) {

        if (switches_[1]) {

            require(amount > 1000000, "Payment must have a value over 1mil base units");
            require(msg.sender != provider, "Can not transfer payment to yourself");
            require(rating > 0 && rating <= 50, "Error, rating must be between 1 & 5");

            uint amountToOwner = amount * fee_ / 10000;
            uint amountToProvider = amount - amountToOwner;

            IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, feeCollector_, amountToOwner);
            IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, provider, amountToProvider);

            uint amountYou;

            if (youBack_ != 0) {

                if (tokenMapping[ticker].oracleAddress != address(0)) {
                    priceFeed = AggregatorV3Interface(tokenMapping[ticker].oracleAddress);
                    (, int price, , , ) = priceFeed.latestRoundData();
                    (uint8 decimals) = priceFeed.decimals();

                    amountYou = amount * uint(price) / (10 ** uint(decimals)) * youBack_ / 10000;
                    youToken.mint(msg.sender,amountYou);

                } else {
                    amountYou = amount * tokenMapping[ticker].manualTokenPrice / (10 ** tokenMapping[ticker].manualOracleDecimals) * youBack_ / 10000;
                    youToken.mint(msg.sender,amountYou);
                }
                
                claimableAmount[booking] = amountYou * 100 / providerYouRatio_;
                claimableAddress[booking] = provider;
            }

            emit PaymentDone(msg.sender, provider, booking, amount, ticker, amountYou, rating, fee_);

        }
    }

    function depositStake(uint amount) public {

        if (switches_[2]) {
        
            require(isDeposited[msg.sender] == false, 'Error, deposit already active');
            require(amount >= (10**16), 'Error, deposit must be >= 0.01 YOU');

            youToken.transferFrom(msg.sender,address(this),amount);

            youBalanceOf[msg.sender] = amount;
            depositStart[msg.sender] = block.timestamp;
            isDeposited[msg.sender] = true; //activate deposit status

            emit DepositStake(msg.sender, amount, block.timestamp);

        }
    }

    function myStakeInterest() public view returns (uint interest) {
        require(isDeposited[msg.sender]==true, 'Error, no previous deposit');
        
        //check user's hodl time
        uint depositTime = block.timestamp - depositStart[msg.sender];
        //calc interest per second
        uint interestPerSecond = 3166802 * interest_ * youBalanceOf[msg.sender] / 1e18;
        //calc accrued interest
        interest = interestPerSecond * depositTime;

    }

    function withdrawStake() public {
        require(isDeposited[msg.sender] == true, 'Error, no previous deposit');
        require(block.timestamp - depositStart[msg.sender] >= minStakeTime_, 'Error, wait for minimum staking duration before withdrawing');

        //check user's hodl time
        uint depositTime = block.timestamp - depositStart[msg.sender];

        //31668017 - interest(10% APY) per second for min. deposit amount (0.01 YOU), cuz:
        //1e15(10% of 0.01 YOU) / 31577600 (seconds in 365.25 days)

        //(youBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
        //for min. deposit (0.01 YOU), (youBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
        //for deposit 0.02 YOU, (youBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
        uint interestPerSecond = 3166802 * interest_ * youBalanceOf[msg.sender] / 1e18;
        uint interestToPay = interestPerSecond * depositTime;

        uint userBalance = youBalanceOf[msg.sender]; //for event
        //reset depositer data
        depositStart[msg.sender] = 0;
        youBalanceOf[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        youToken.mint(msg.sender, interestToPay); //interest to user
        youToken.transfer(msg.sender,userBalance); //send funds back to user

        emit WithdrawStake(msg.sender, userBalance, depositTime, interestToPay);
    }


    function reviewClaim(bytes32 booking, uint rating) public {

        if (switches_[3]) {

            require(claimableAmount[booking] > 0, "Error, already claimed for this booking");
            require(claimableAddress[booking] == msg.sender, "Error, only claimable by service provider of booking");
            require(rating > 0 && rating <= 50, "Error, rating must be between 1 & 5");

            uint claimableNow = claimableAmount[booking];
            claimableAmount[booking] = 0;
            youToken.mint(msg.sender,claimableNow);

            emit ReviewedUser(msg.sender, booking, rating, claimableNow); // add msg.sender & claimableNow amount to event emitted

        }
    }

    function transferToken(address _to, uint amount, bytes32 ticker) public tokenExists(ticker) {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),"Error: You must have super admin role to transfer tokens.");
        IERC20(tokenMapping[ticker].tokenAddress).transfer(_to,amount);
    }

    function transferEth(address _to, uint amount) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),"Error: You must have super admin role to transfer eth.");
        payable(_to).transfer(amount);
    }

    function mintYou(address _to, uint amount) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),"Error: You must have super admin role to mint YOU tokens.");
        youToken.mint(_to,amount);
    }

    fallback() external payable {
        // custom function code
    }

    receive() external payable {
        // custom function code
    }

}
