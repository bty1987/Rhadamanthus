package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.utils.Paging;

public interface WalletDao extends Dao<WalletPO> {

	public List<WalletPO> pageWallet(Paging paging, List<Filter> filters);

	public WalletPO queryWalletByNo(String no);

	/**
	 * 原子扣减余额: UPDATE payment.wallet SET balance = balance - :delta WHERE wid = :wid AND balance >= :delta
	 * 返回受影响行数, 0 表示余额不足
	 */
	public int decreaseBalance(long wid, long delta);

	/**
	 * 原子增加余额: UPDATE payment.wallet SET balance = balance + :delta WHERE wid = :wid
	 */
	public int increaseBalance(long wid, long delta);

}
