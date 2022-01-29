package com.fanglin.salary.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.salary.dao.SalaryDrawingDao;
import com.fanglin.salary.po.SalaryDrawingPO;

@Repository("salaryDrawingDao")
public class SalaryDrawingDaoImpl extends DaoImpl<SalaryDrawingPO> implements SalaryDrawingDao {

	public SalaryDrawingDaoImpl() {
		super(SalaryDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalaryDrawingPO> querySalaryDrawing(Long sid, Short type) {

		return session().createCriteria(SalaryDrawingPO.class).add(Restrictions.eq(SalaryDrawingPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(SalaryDrawingPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq("status", SalaryDrawingPO.STATUS_INIT_INT)).list();

	}

	@Override
	public int countSalaryDrawing(Long sid, Short type) {

		String sql = "SELECT count(*) FROM salary.salarydrawing where sid = :sid and type = :type";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).setShort("type", type).uniqueResult();

		return count.intValue();
	}
}
