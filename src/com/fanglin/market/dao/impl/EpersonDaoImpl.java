package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EpersonDao;
import com.fanglin.market.po.EpersonPO;
import com.fanglin.utils.Paging;

@Repository("euserDao")
public class EpersonDaoImpl extends DaoImpl<EpersonPO> implements EpersonDao{

	public EpersonDaoImpl(){
		super(EpersonPO.class);
	}
	
	@Override
	public List<EpersonPO> pageEperson(Paging paging, List<Filter> filters) {
		
		PagingQuery<EpersonPO> query = pagingQuery(paging, EpersonPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals(EpersonPO.COLUMN_TYPE_STR)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if (field.equals(EpersonPO.COLUMN_NAME_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("cityId")){
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}else if(field.equals("pinyin")){
					query.add(Restrictions.or(Restrictions.like("pinyin", data, MatchMode.START), Restrictions.like("name", data, MatchMode.START)));
				}
			}
		}
		
		return query.list();
	}
	
	@Override
	public EpersonPO queryEpersonByEuid(long euid) {
		
		return (EpersonPO) session().createCriteria(EpersonPO.class).add(Restrictions.eq(EpersonPO.COLUMN_EUID_STR, euid)).uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<EpersonPO> queryEpersonByPinYin(String pinyin) {
		
		return session().createCriteria(EpersonPO.class).add(Restrictions.like(EpersonPO.COLUMN_PINYIN_STR, pinyin, MatchMode.START)).list();
	}

}
