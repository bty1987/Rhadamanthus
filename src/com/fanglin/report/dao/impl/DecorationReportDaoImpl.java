package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
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
	@SuppressWarnings("deprecation")
	public List<?> queryDecorationConstruction() {

		String sql = "SELECT company, projectStatus, COUNT(*) as count FROM decoration.decoration GROUP BY company, projectStatus";
		SQLQuery query = session().createSQLQuery(sql.toString()).addScalar("company", Hibernate.INTEGER).addScalar("projectStatus", Hibernate.INTEGER).addScalar("count", Hibernate.INTEGER);
		return query.list();
	}

	@Override
	public List<?> queryDecorationConstructionAllCdidADcid() {

		String sql = "SELECT cdid, dcid FROM report.decoration4construction";
		return  session().createSQLQuery(sql).list();
	}

}
