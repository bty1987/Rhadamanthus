package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.WalletranVO;
import com.fanglin.utils.Paging;

public interface WalletranService {

	public void pageWalletran(Paging paging, List<Filter> filters);

	public List<WalletranVO> queryWalletran(WalletranVO walletran);

}
