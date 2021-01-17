package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.WalletranPO;
import com.fanglin.utils.Paging;

public interface WalletranDao extends Dao<WalletranPO> {

	public List<WalletranPO> pageWalletran(Paging paging, List<Filter> filters);

	public List<WalletranPO> querywalletran(Long wid);

}
