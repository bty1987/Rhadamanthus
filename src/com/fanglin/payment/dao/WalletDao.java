package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.utils.Paging;

public interface WalletDao extends Dao<WalletPO> {

	public List<WalletPO> pageWallet(Paging paging, List<Filter> filters);

	public WalletPO queryWalletByNo(String no);

}
