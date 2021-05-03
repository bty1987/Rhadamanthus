package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.WalletresVO;

public interface WalletresService {

	public List<WalletresVO> queryWalletres(WalletresVO walletres);

	public void addWalletres(WalletresVO walletres) throws FLException;

	public void deleteWalletres(WalletresVO walletres);

}
