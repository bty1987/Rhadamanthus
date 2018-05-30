package com.fanglin.store.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.utils.Paging;

@Repository("mgoodsDao")
public class MgoodsDaoImpl extends DaoImpl<MgoodsPO> implements MgoodsDao {
	
	public MgoodsDaoImpl() {
		super(MgoodsPO.class);
	}

	@Override
	public List<MgoodsPO> pageMgoods(Paging paging, List<Filter> filters) {
		
		PagingQuery<MgoodsPO> query = pagingQuery(paging, MgoodsPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(MgoodsPO.COLUMN_BID_STR)){
					query.alias("mbrand", "mbrand");
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}else if(field.equals("no")){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("barcode")){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("name")){
					query.add(query.getCriterion(field, data, op));
				}
			}
		}
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MgoodsPO> queryMgoods(Long bid, Short status) {
		
		Criteria criteria = session().createCriteria(MgoodsPO.class);
		
		if(bid != null){
			criteria.add(Restrictions.eq(MgoodsPO.COLUMN_BID_STR, bid));
		}
		
		if(status != null){
			criteria.add(Restrictions.eq("status", status));
		}
		
		return criteria.list();
		
	}

	@Override
	public List<MgoodsPO> queryMgoodsBypinyinName(Paging paging, String pinyinName) {
		
		PagingQuery<MgoodsPO> query = pagingQuery(paging, MgoodsPO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
		    query.add(Restrictions.or(Restrictions.like("pinyinName", pinyinName, MatchMode.START), Restrictions.like("name", pinyinName, MatchMode.START)));
		}
		
		return query.list();
		
	}

}
