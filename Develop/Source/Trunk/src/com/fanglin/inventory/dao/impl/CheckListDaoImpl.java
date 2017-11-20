/**
 * @File Name		: CheckListDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.CheckListDao;
import com.fanglin.inventory.po.CheckListPO;
import com.fanglin.utils.Paging;

@Repository("checkListDao")
public class CheckListDaoImpl extends DaoImpl<CheckListPO> implements CheckListDao {
	
	public CheckListDaoImpl(){
		super(CheckListPO.class);
	}
	
	@Override
	public List<CheckListPO> pageCheckList(Paging paging, List<Filter> filters, List<Long> shids) {
		
		PagingQuery<CheckListPO> query = pagingQuery(paging, CheckListPO.class);
		
		query.alias("storehouse", "storehouse").add(query.getCriterion(CheckListPO.COLUMN_STOREHOUSE_SHID_STR, shids, "in"));
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("goods", "goods");
				query.alias("color", "color");
				query.alias("format", "format");
				query.alias("storehouse", "storehouse");
				
				if(CheckListPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(CheckListPO.COLUMN_STOREHOUSE_NAME_STR, data, op));
				}else if("brand".equals(field)){
					query.add(query.getCriterion(CheckListPO.COLUMN_BRAND_STR, data, op));
				}else if("goodsName".equals(field)){
					query.add(query.getCriterion(CheckListPO.COLUMN_GOODS_NAME_STR, data, op));
				}
			}
		}
	}


}
