package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationContractRecordDao;
import com.fanglin.decoration.po.DecorationContractRecordPO;

@Repository("decorationContractRecordDao")
public class DecorationContractRecordDaoImpl extends DaoImpl<DecorationContractRecordPO> implements DecorationContractRecordDao {

	public DecorationContractRecordDaoImpl() {
		super(DecorationContractRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationContractRecordPO> queryDecorationContractRecord(String orderId) {
		return createCriteria(DecorationContractRecordPO.class)
				.add(Restrictions.eq("orderId", orderId))
				.list();
	}

	@Override
	public DecorationContractRecordPO querySingleDecorationContractRecord(String orderId) {
		List<DecorationContractRecordPO> list = queryDecorationContractRecord(orderId);
		return (list != null && !list.isEmpty()) ? list.get(0) : null;
	}

}
