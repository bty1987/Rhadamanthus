package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.report.dao.DecorationReportDao;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.utils.Paging;

@Repository("DecorationReportDao")
public class DecorationReportDaoImpl extends DaoImpl<DecorationReportPO> implements DecorationReportDao{

	public DecorationReportDaoImpl() {
		super(DecorationReportPO.class);
	}

	@Override
	public List<DecorationReportPO> queryDecoration7Construction(Paging paging, List<Filter> filters) {
		
		PagingQuery<DecorationReportPO> query = pagingQuery(paging, DecorationReportPO.class);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForConstruction() {
		
		String sql = "SELECT company, projectStatus, COUNT(*) as count FROM decoration.decoration GROUP BY company, projectStatus";
		SQLQuery query = session().createSQLQuery(sql.toString()).addScalar("company", StandardBasicTypes.INTEGER).addScalar("projectStatus", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForContract(List<Integer> year) {
		
		StringBuffer sql = new StringBuffer();
		sql.append("SELECT company, year - 2001 AS type, COUNT(*) AS count FROM (");
		sql.append("SELECT company, YEAR(contractTime) AS year FROM decoration.decoration WHERE YEAR(contractTime) IN (:year) AND status = :status");
		sql.append(")a GROUP BY company,year");
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setShort("status", DecorationPO.STATUS_SIGNED_INT).setParameterList("year", year);		
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("type", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);		
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForPaySacle(int min, Integer max,Integer type) {
		
		String sql = "SELECT company,:type,COUNT(*) AS count FROM decoration.decoration WHERE paySacle between :min AND :max  GROUP BY company";
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setInteger("min", min).setInteger("max", max).setInteger("type", type);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar(String.valueOf(type), StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForDesignStatus(List<Short> designStatus) {
		String sql = "SELECT company, designStatus + 23 AS type, COUNT(*) as count FROM decoration.decoration WHERE designStatus IN (:designStatus) GROUP BY company, designStatus";

		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setParameterList("designStatus", designStatus);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("type", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);		
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> countDecorationForDeposit(short deposit) {
		String sql = "SELECT company, 26, COUNT(*) as count FROM decoration.decoration  WHERE status =:deposit  GROUP BY  company, status";
		
		SQLQuery query = (SQLQuery) session().createSQLQuery(sql.toString()).setShort("deposit", deposit);
		query.addScalar("company", StandardBasicTypes.INTEGER).addScalar("26", StandardBasicTypes.INTEGER).addScalar("count", StandardBasicTypes.INTEGER);
		
		return query.list();
	}
	
	@Override
	public void truncateDecoration7Construction() {
        
		String sql = " TRUNCATE TABLE report.decoration4construction";
        SQLQuery query = session().createSQLQuery(sql);
        query.executeUpdate();
    }
	
}