   // let userTx;

    // useEffect(() => {

    //     (async () => {
    //         setUserTx(await getUserTrans());
    //     })();

    // }, [])

    // let getUserTrans = async () => {
    //     const options = { chain: "0x4" }
    //     const userTrans = await Moralis.Web3.getTransactions(options);
    //     console.log("userTrans",userTrans)
    //     return userTrans;
    // }


    // let provider;

    // const createEthWallet = async () => {
    //     try {
    //         let newEthAccount = uweb3.eth.accounts.create();
    //         const encryptedEthAccount = uweb3.eth.accounts.encrypt(newEthAccount.privateKey, window.prompt("Please enter your wallet password"));
    //         await setUserData({
    //             encryptedEthAccount: { address: newEthAccount.address, file: encryptedEthAccount },
    //         });

    //         setEncryptedEthAccount(encryptedEthAccount);

    //         console.log("unenc", newEthAccount.address);
    //         console.log("user", user);
    //         newEthAccount = null;

    //         // console.log(web3.utils.fromWei(balance, "ether"))
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // // console.log("enc", encryptedEthAccount);
    // // console.log("eth", ethAddress);


    // const getEncryptedWallet = async () => {
    //     setEncryptedEthAccount(user.attributes.encryptedEthAccount ? user.attributes.encryptedEthAccount : {})
    // };


    // const decryptEthWallet = async () => {
    //     try {
    //         let decryptedAccount = uweb3.eth.accounts.decrypt(encryptedEthAccount.file, window.prompt("Please enter your wallet password"));
    //         console.log("dec", decryptedAccount);
    //         setEthAddress(decryptedAccount.address);
    //         console.log("g1")
    //         console.log(process.env.REACT_APP_RINKEBY_SPEEDY_NODE)
    //         provider = new HDWalletProvider(decryptedAccount.privateKey, process.env.REACT_APP_RINKEBY_SPEEDY_NODE);
    //         console.log("gah")
    //         var uWeb3 = new Web3(provider);
    //         setUweb3(uWeb3);
    //         provider.engine.stop();

    //         uWeb3.eth.getAccounts(console.log);
    //         try {
    //             console.log("uweb3 Eth:", await uWeb3.eth.getBalance(decryptedAccount.address));
    //         } catch (error) {
    //             setErrorContents(["Error getting wallet info", error.message]);
    //             setShowAlert(true);
    //         }

    //         decryptedAccount = null;

    //     } catch (error) {
    //         console.log(error);
    //         alert("wrong wallet password");
    //     }
    // }

    // const deleteEthWallet = async () => {
    //     user.unset("encryptedEthAccount");
    //     await user.save();
    //     setEthAddress("");
    //     console.log('delete');
    // }