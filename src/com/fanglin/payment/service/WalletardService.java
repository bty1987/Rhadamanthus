package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.WalletardVO;

public interface WalletardService {

	public List<WalletardVO> queryWalletard(WalletardVO walletard);

	public WalletardVO bindWalletard(WalletardVO Walletard) throws FLException;

	public void confirmWalletard(WalletardVO walletard) throws FLException;

	public void unbindWalletard(WalletardVO walletard) throws FLException;

	public void deleteWalletard(WalletardVO walletard) throws FLException;

}
