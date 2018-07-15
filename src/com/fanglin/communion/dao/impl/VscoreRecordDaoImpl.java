package com.fanglin.communion.dao.impl;


import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VscoreRecordDao;
import com.fanglin.communion.po.VscoreRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;


@Repository("vscoreRecordDao")
public class VscoreRecordDaoImpl extends DaoImpl<VscoreRecordPO> implements VscoreRecordDao {

	public VscoreRecordDaoImpl(){
		super(VscoreRecordPO.class);
	}
	
	@Override
	public List<VscoreRecordPO> pageVscoreRecordByUnionId(Paging paging, List<Filter> filters, String unionId) {
		
		PagingQuery<VscoreRecordPO> query = pagingQuery(paging, VscoreRecordPO.class);
		
		if(filters != null){
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				
				if("VscoreRecordType".equals(field)){
					query.add(Restrictions.eq("type", Short.valueOf(filter.getData())));
				}
			}
		}
		
		query.add(Restrictions.eq(VscoreRecordPO.COLUMN_UNIONID_STR, unionId));
		
		return query.list();
	}
	
}
