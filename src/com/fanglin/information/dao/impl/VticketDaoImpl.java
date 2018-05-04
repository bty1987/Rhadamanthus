package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VticketPO;
import com.fanglin.utils.Paging;

@Repository("vticketDao")
public class VticketDaoImpl extends DaoImpl<VticketPO> implements VticketDao {
	
	public VticketDaoImpl(){
		super(VticketPO.class);
	}

	@Override
	public List<VticketPO> pageVticket(Paging paging, List<Filter> filters) {
		
		PagingQuery<VticketPO> query = pagingQuery(paging, VticketPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(VticketPO.COLUMN_TNO_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals(VticketPO.COLUMN_ORDERID_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals(VticketPO.COLUMN_NAME_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals(VticketPO.COLUMN_BELONGER_STR)){
					query.alias("belonger", "belonger");
					query.add(query.getCriterion(field, Integer.valueOf(data), op));
				}
			}
		}
		
		return query.list();
		
	}

	@Override
	public List<?> countVticket(short param) {
		
		String sql = null;
		
		switch (param){
			case 1:
		    	sql = "SELECT d.deptName AS 'regionName', de.deptName AS 'deptName', COUNT(*) from information.vticket v, communion.department d, communion.department de where v.rid = d.dId and v.did = de.dId and v.iscome = 1 GROUP BY v.rid, v.did";
		    	break;
		    case 2:
		    	sql = "SELECT d.deptName AS 'regionName', de.deptName AS 'deptName', COUNT(*) from information.vticket v, communion.department d, communion.department de where v.rid = d.dId and v.did = de.dId and v.isregist = 1 GROUP BY v.rid, v.did";
		    	break;
		    default:
		    	sql = "SELECT d.deptName AS 'regionName', de.deptName AS 'deptName', COUNT(*) from information.vticket v, communion.department d, communion.department de where v.rid = d.dId and v.did = de.dId  GROUP BY v.rid, v.did";
		    	break;
		}
		
		return session().createSQLQuery(sql).list();
		
	}

	@Override
	public VticketPO queryVticketByVtid(Long vtid) {
		
		return (VticketPO) session().createCriteria(VticketPO.class).add(Restrictions.eq(VticketPO.COLUMN_VTID_STR, vtid)).uniqueResult();
		
	}

	@Override
	public VticketPO queryVticketByTno(String tno) {
		
		return (VticketPO) session().createCriteria(VticketPO.class).add(Restrictions.eq(VticketPO.COLUMN_TNO_STR, tno)).uniqueResult();
		
	}

}
