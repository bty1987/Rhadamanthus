package com.fanglin.building.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.CustomerSourceDao;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerSourceDao")
public class CustomerSourceDaoImpl extends DaoImpl<CustomerSourcePO> implements CustomerSourceDao {

	public CustomerSourceDaoImpl(){
		super(CustomerSourcePO.class);
	}

	@Override
	public List<CustomerSourcePO> pageCustomerSource(Paging paging, List<Filter> filters, Integer uid) {
		
		PagingQuery<CustomerSourcePO> query = pagingQuery(paging, CustomerSourcePO.class);
		
		query.add(query.getCriterion("create.uid", uid, "eq"));
		if(filters != null){
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("userName".equals(field)){
					query.alias("customer", "customer");
					query.add(query.getCriterion("customer.name", data, op));
				}else if("no".equals(field)){
					query.add(query.getCriterion("no", data, op));
				}
				
			}
		}
		return query.list();
	}
	
	@Override
	public CustomerSourcePO queryCustomerSourceForNo(String no) {
		
		return (CustomerSourcePO)session().createCriteria(CustomerSourcePO.class).add(Restrictions.eq(CustomerSourcePO.COLUMN_NO_STR, no)).uniqueResult();
	
	}
	
	@Override
	public CustomerSourcePO checkCustomerSourceByCidAndType(Long cid, Short type) {
		
		return (CustomerSourcePO)session().createCriteria(CustomerSourcePO.class).add(Restrictions.eq(CustomerSourcePO.COLUMN_CID_STR, cid)).add(Restrictions.eq(CustomerSourcePO.COLUMN_TYPE_STR, type)).uniqueResult();
		
	}

	@Override
	public int countCustomerSource(Long cid, Short type) {
		
		String sql = "select count(*) from building.customerSource where cid = :cid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setShort("type", type).uniqueResult();
		
		return count.intValue();
	}

}
