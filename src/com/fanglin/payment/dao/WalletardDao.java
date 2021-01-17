package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.WalletardPO;

public interface WalletardDao extends Dao<WalletardPO> {

	public List<WalletardPO> queryWalletard(Long wid);

}
