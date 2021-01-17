package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.WalletresPO;

public interface WalletresDao extends Dao<WalletresPO> {

	public List<WalletresPO> queryWalletres(Long wid);

}
