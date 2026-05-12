package com.fanglin.dingding.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.dingding.dao.DingTalkApprovalConfigDao;
import com.fanglin.dingding.po.DingTalkApprovalConfigPO;

@Repository("dingTalkApprovalConfigDao")
public class DingTalkApprovalConfigDaoImpl extends DaoImpl<DingTalkApprovalConfigPO> implements DingTalkApprovalConfigDao {

	public DingTalkApprovalConfigDaoImpl() {
		super(DingTalkApprovalConfigPO.class);
	}

	@Override
	public DingTalkApprovalConfigPO queryByProcessCode(String processCode) {

		return (DingTalkApprovalConfigPO) session().createCriteria(DingTalkApprovalConfigPO.class)
			.add(Restrictions.eq(DingTalkApprovalConfigPO.COLUMN_PROCESSCODE_STR, processCode))
			.add(Restrictions.eq(DingTalkApprovalConfigPO.COLUMN_ENABLED_STR, (short) 1))
			.add(Restrictions.eq(DingTalkApprovalConfigPO.COLUMN_TYPE_STR, DingTalkApprovalConfigPO.TYPE_SPECIALIZED))
			.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<String> queryEnabledGenericProcessCodes() {

		List<DingTalkApprovalConfigPO> configs = session().createCriteria(DingTalkApprovalConfigPO.class)
			.add(Restrictions.eq(DingTalkApprovalConfigPO.COLUMN_ENABLED_STR, (short) 1))
			.add(Restrictions.eq(DingTalkApprovalConfigPO.COLUMN_TYPE_STR, DingTalkApprovalConfigPO.TYPE_GENERIC))
			.list();

		List<String> codes = new ArrayList<String>();
		for (DingTalkApprovalConfigPO config : configs) {
			codes.add(config.getProcessCode());
		}
		return codes;
	}

}
