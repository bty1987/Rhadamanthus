package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.WalletVO;
import com.fanglin.utils.Paging;

public interface WalletService {

	public void pageWallet(Paging paging, List<Filter> filters);

	public WalletVO queryWallet(WalletVO wallet);

	public void applyWallet(WalletVO wallet, String userId);

	public WalletVO bindWallet(WalletVO wallet) throws FLException;

	public WalletVO updateWallet(WalletVO wallet) throws FLException;

	public void confirmWallet(WalletVO wallet) throws FLException;
	
	public void freezeWallet(WalletVO wallet) throws FLException;
	
	public void unfreezeWallet(WalletVO wallet) throws FLException;

	public WalletVO consumeWallet(WalletVO wallet, WalletVO tallet) throws FLException;

	public WalletVO rechargeWallet(WalletVO wallet) throws FLException;

	public WalletVO withdrawWallet(WalletVO wallet) throws FLException;

	public void consentWallet(WalletVO wallet) throws FLException;

	public WalletVO transferWallet(WalletVO wallet, WalletVO tallet) throws FLException;

	public void approveWallet(WalletVO wallet) throws FLException;

}
