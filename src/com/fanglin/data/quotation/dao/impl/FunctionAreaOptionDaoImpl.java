package com.fanglin.data.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaOptionPO;
import com.fanglin.data.quotation.dao.FunctionAreaOptionDao;

@Repository("functionAreaOptionDao")
public class FunctionAreaOptionDaoImpl extends DaoImpl<FunctionAreaOptionPO> implements FunctionAreaOptionDao {

	public FunctionAreaOptionDaoImpl() {
		super(FunctionAreaOptionPO.class);
	}

	@Override
	public int deleteFunctionAreaOptionByFaid(long faid) {

		String sql = "delete from data.functionareaoption where faid = :faid";
		session().createSQLQuery(sql).setLong("faid", faid).executeUpdate();

		return 0;
	}

}
