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

import java.math.BigDecimal;
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
	public List<GoodsStorehouseStockPO> pageGoodsStorehouseStock(Paging paging, List<Filter> filters, List<Long> shids) {
		
		PagingQuery<GoodsStorehouseStockPO> query = pagingQuery(paging, GoodsStorehouseStockPO.class);
		
		query.alias("storehouse", "storehouse").add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_SHID_STR, shids, "in"));
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public GoodsStorehouseStockPO queryGoodsStorehouseStockByShIdAGId(long gid, long cid, long fid, long shId) {
		return (GoodsStorehouseStockPO) session().createCriteria(GoodsStorehouseStockPO.class).createAlias("goods", "goods").createAlias("color", "color").createAlias("format", "format").createAlias("storehouse", "storehouse").add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_CID_STR, cid)).add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_FID_STR, fid)).add(Restrictions.eq(GoodsStorehouseStockPO.COLUMN_SHID_STR, shId)).uniqueResult();
	}
	
	@Override
	public Float queryGoodsStorehouseStockByGid(long gid, long cid, long fid){
		
		String sql = "SELECT SUM(num) as nums from inventory.goodsstorehousestock where gid= :gid and cid= :cid AND fid= :fid";
		
		BigDecimal nums = (BigDecimal) session().createSQLQuery(sql).setLong("gid", gid).setLong("cid", cid).setLong("fid", fid).uniqueResult();
		
		if(nums==null){
			
			nums = BigDecimal.ZERO;
			
		}
		
		return nums.floatValue();
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
				query.alias("storehouse", "storehouse");
				
				if(GoodsStorehouseStockPO.COLUMN_GID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_GID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_CID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_CID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_FID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_FID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_SHID_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_SHID_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_SNAME_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_STOREHOUSNAME_STR, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if(GoodsStorehouseStockPO.COLUMN_BARCODE_STR.equals(field)){
					query.add(query.getCriterion(GoodsStorehouseStockPO.COLUMN_CODE_STR, data, op));
				}
			}
		}
	}

}
