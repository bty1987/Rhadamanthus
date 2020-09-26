package com.fanglin.data.material.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.AoodsDao;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("aoodsDao")
public class AoodsDaoImpl extends DaoImpl<AoodsPO> implements AoodsDao {
	
	public AoodsDaoImpl(){
		super(AoodsPO.class);
	}

	@Override
	public List<AoodsPO> pageAoods(Paging paging, List<Filter> filters, int company, String companyType) {

		PagingQuery<AoodsPO> query = pagingQuery(paging, AoodsPO.class);
		
		if (companyType != null) {
			query.add(query.getCriterion(companyType, company, "eq"));
		}
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AoodsPO> queryAoodsByName(String name, int limit, int company) {
		return session().createCriteria(AoodsPO.class).createAlias("goods", "goods").add(Restrictions.eq(AoodsPO.COLUMN_BOMPANY_STR, company)).add(Restrictions.eq(AoodsPO.COLUMN_STATUS_STR, AoodsPO.STATUS_ENABLE_INT)).add(Restrictions.or(Restrictions.or(Restrictions.ilike(AoodsPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE),Restrictions.ilike(AoodsPO.COLUMN_NO_STR, name, MatchMode.ANYWHERE)), Restrictions.ilike(AoodsPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE))).setMaxResults(limit).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AoodsPO> queryAoodsByAtid(long atid, int company) {
		return session().createCriteria(AoodsPO.class).add(Restrictions.eq("accessoriesType.atid", atid)).add(Restrictions.eq(AoodsPO.COLUMN_STATUS_STR, AoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq("bompany", company)).list();
	}

	@Override
	public int countAoods(long gid, int bompany) {
		
		String sql = "select count(*) from `data`.aoods where gid= :gid and bompany= :bompany";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("gid", gid).setInteger("bompany", bompany).uniqueResult();
		
		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<AoodsPO> query,List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (AoodsPO.COLUMN_NAME_STR.equals(field)) {
					query.alias("goods", "goods");
					query.add(query.getCriterion(AoodsPO.COLUMN_NAME_STR, data, op));
				} else if (AoodsPO.COLUMN_ANAME_STR.equals(field)) {
					query.alias("accessoriesType", "accessoriesType");
					query.add(query.getCriterion(AoodsPO.COLUMN_ANAME_STR, data, op));
				} else if (AoodsPO.COLUMN_STATUS_STR.equals(field)) {
					query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
				} else if (AoodsPO.COLUMN_BOMPANY_STR.equals(field)) {
					try {
						int cid = FormatUtil.decodeCompany(AESHelper.decrypt(filter.getData(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
						query.add(Restrictions.eq("bompany", Integer.valueOf(cid)));
					} catch (Exception e) {}
				}
			}
		}
		
	}

}
