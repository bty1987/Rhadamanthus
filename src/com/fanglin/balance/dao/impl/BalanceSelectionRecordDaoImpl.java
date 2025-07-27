package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSelectionRecordDao;
import com.fanglin.balance.po.BalanceSelectionRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("balanceSelectionRecordDao")
public class BalanceSelectionRecordDaoImpl extends DaoImpl<BalanceSelectionRecordPO> implements BalanceSelectionRecordDao {

	public BalanceSelectionRecordDaoImpl() {
		super(BalanceSelectionRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSelectionRecordPO> queryBalanceSelectionRecord(long bsid) {
		return session().createCriteria(BalanceSelectionRecordPO.class).createAlias("balanceSelection", "balanceSelection").add(Restrictions.eq("balanceSelection.bsid", bsid)).list();
	}

}
