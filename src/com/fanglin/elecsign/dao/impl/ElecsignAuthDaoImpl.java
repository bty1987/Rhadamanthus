package com.fanglin.elecsign.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.elecsign.dao.ElecsignAuthDao;
import com.fanglin.elecsign.po.ElecsignAuthPO;

@Repository("elecsignAuthDao")
public class ElecsignAuthDaoImpl extends DaoImpl<ElecsignAuthPO> implements ElecsignAuthDao {

	public ElecsignAuthDaoImpl() {
		super(ElecsignAuthPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public ElecsignAuthPO queryElecsignAuthByCidAndProvider(int cid, short provider) {

		List<ElecsignAuthPO> elecsignAuthPOs = session().createCriteria(ElecsignAuthPO.class)
			.add(Restrictions.eq("cid", cid))
			.add(Restrictions.eq("provider", provider))
			.list();

		return elecsignAuthPOs.isEmpty() ? null : elecsignAuthPOs.get(0);
	}

	@Override
	@SuppressWarnings("unchecked")
	public ElecsignAuthPO queryElecsignAuthByToken(String token) {

		// token 仅活跃认证流持有(新流覆盖/清空旧值), 单值天然防串, 不按状态过滤——
		// 发起认证时行仍是 INIT, 回调必须能反查到
		List<ElecsignAuthPO> elecsignAuthPOs = session().createCriteria(ElecsignAuthPO.class)
			.add(Restrictions.eq("token", token))
			.list();

		return elecsignAuthPOs.isEmpty() ? null : elecsignAuthPOs.get(0);
	}

}
