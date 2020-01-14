package com.fanglin.data.material.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AoodsCostDao;
import com.fanglin.data.po.AoodsCostPO;
import com.fanglin.utils.Paging;

@Repository("aoodsCostDao")
public class AoodsCostDaoImpl extends DaoImpl<AoodsCostPO> implements AoodsCostDao {

	public AoodsCostDaoImpl(){
		super(AoodsCostPO.class);
	}
	
	@Override
	public List<AoodsCostPO> pageAoodsCost(Paging paging, List<Filter> filters, long aid) {
		
		PagingQuery<AoodsCostPO> query = pagingQuery(paging, AoodsCostPO.class);
		query.alias("aoods", "aoods");
		query.add(query.getCriterion("aoods.aid",aid,"eq"));
		
		return query.list();
	}

	@Override
	public int countAoodsCost(long aid, long ccid) {
		
		String sql = "select count(*) from `data`.aoodscost where aid= :aid and ccid= :ccid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("aid", aid).setLong("ccid", ccid).uniqueResult();
		
		return count.intValue();
	}

}
