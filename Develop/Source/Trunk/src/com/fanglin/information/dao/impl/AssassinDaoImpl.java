package com.fanglin.information.dao.impl;

import org.springframework.stereotype.Repository;
import com.fanglin.information.dao.AssassinDao;
import com.fanglin.information.po.AssassinPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("assassinDao")
public class AssassinDaoImpl extends DaoImpl<AssassinPO> implements AssassinDao {

	public AssassinDaoImpl() {
		super(AssassinPO.class);
	}

}
