package com.fanglin.dingding.dao.impl;

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
			.uniqueResult();
	}

}
