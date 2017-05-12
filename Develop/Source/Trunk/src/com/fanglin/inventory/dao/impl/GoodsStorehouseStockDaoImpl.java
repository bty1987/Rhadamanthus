/**
 * @File Name		: GoodsStorehouseStockDaoImpl.java
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
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.GoodsStorehouseStockDao;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.utils.Paging;

@Repository("goodsStorehouseStockDao")
public class GoodsStorehouseStockDaoImpl extends DaoImpl<GoodsStorehouseStockPO> implements GoodsStorehouseStockDao {
	
	public GoodsStorehouseStockDaoImpl(){
		super(GoodsStorehouseStockPO.class);
	}
	
	@Override
	public List<GoodsStorehouseStockPO> pageGoodsStorehouseStock(Paging paging, List<Filter> filters) {
		
		PagingQuery<GoodsStorehouseStockPO> query = pagingQuery(paging, GoodsStorehouseStockPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public GoodsStorehouseStockPO queryGoodsStorehouseStockByShIdAGId(long gid, long shId) {
		return (GoodsStorehouseStockPO) session().createCriteria(GoodsStorehouseStockPO.class).createAlias("goods", "goods").createAlias("color", "color").createAlias("format", "format").createAlias("storehouse", "storehouse").add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_SHID_STR, shId)).uniqueResult();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("goods", "goods");
				query.alias("color", "color");
				query.alias("format", "format");
				
				if(GoodsStorehouseStockPO.COLUMN_GID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_GID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_CID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_CID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_FID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_FID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_SHID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_SHID_STR, data, op));
				}
			}
		}
	}

}
