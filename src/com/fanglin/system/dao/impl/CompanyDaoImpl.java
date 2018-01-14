package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Paging;

@Repository("companyDao")
public class CompanyDaoImpl extends DaoImpl<CompanyPO> implements CompanyDao{

	public CompanyDaoImpl(){
		super(CompanyPO.class);
	}
	  
	@Override
	public List<CompanyPO> pageCompany(Paging paging, List<Filter> filters) {

        PagingQuery<CompanyPO> query = pagingQuery(paging, CompanyPO.class);
        
        if(filters != null){
 			for(Filter filter: filters){
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("name".equals(field)){
					query.add(query.getCriterion(field, data, op));
				}
 			}
 		}
		
		query.asc("cid");
		
        return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CompanyPO> queryCompany() {
		return session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_STATUS_STR, CompanyPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public CompanyPO queryCompanyByName(String name) {
		return  (CompanyPO)session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	@Override
	public CompanyPO queryCompanyByCid(int cid) {
		return (CompanyPO)session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_CID_STR , cid)).uniqueResult();
	}

	@Override
	public CompanyPO queryCompanyByNo(int no) {
		return (CompanyPO)session().createCriteria(CompanyPO.class).add(Restrictions.eq(CompanyPO.COLUMN_NO_STR , no)).uniqueResult();
	}
}
