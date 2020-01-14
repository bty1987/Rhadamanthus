package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionAccessoryDao;
import com.fanglin.construction.po.ConstructionAccessoryPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionAccessoryDao")
public class ConstructionAccessoryDaoImpl extends DaoImpl<ConstructionAccessoryPO> implements ConstructionAccessoryDao{

	public ConstructionAccessoryDaoImpl() {
		super(ConstructionAccessoryPO.class);
	}
	
	@Override
	public List<ConstructionAccessoryPO> pageConstructionAccessory(Paging paging, List<Filter> filters, long cid) {

		PagingQuery<ConstructionAccessoryPO> query = pagingQuery(paging, ConstructionAccessoryPO.class);
		
		query.add(query.getCriterion(ConstructionAccessoryPO.COLUMN_CID_STR, cid, "eq"));

		query.desc("caid");
		
		return query.list();
	}
	
	@Override
	public ConstructionAccessoryPO queryConstructionAccessory(long cid, long gid) {
		
		return (ConstructionAccessoryPO) session().createCriteria(ConstructionAccessoryPO.class).createAlias("aoods", "aoods").createAlias("aoods.goods", "goods").add(Restrictions.eq("cid", cid)).add(Restrictions.eq("goods.gid", gid)).uniqueResult();
	}	

	@Override
	public int makeConstructionAccessory(long cid, long ccid) {
		
		String sql = "insert into construction.constructionaccessory(cid, aid, checkup, numLimit) select :cid, ad.aid , 0, ast.numlimit FROM `data`.aoodscost AS ast,`data`.aoods AS ad WHERE ast.aid = ad.aid AND ast.ccid = :ccid AND ad.`status` = 0";
		
		session().createSQLQuery(sql).setLong("cid", cid).setLong("ccid", ccid).executeUpdate();
		
		return 0;
	}

	@Override
	public int countConstructionAccessory(long cid) {

		String sql = "select count(*) from construction.constructionaccessory where cid = :cid ";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).uniqueResult();

		return count.intValue();
	}


}
