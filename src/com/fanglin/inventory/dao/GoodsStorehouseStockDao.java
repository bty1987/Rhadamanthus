/**
 * @File Name		: GoodsStorehouseStockDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.GoodsStorehouseStockPO;
import com.fanglin.utils.Paging;

public interface GoodsStorehouseStockDao extends Dao<GoodsStorehouseStockPO> {
	
	public List<GoodsStorehouseStockPO> pageGoodsStorehouseStock(Paging paging, List<Filter> filters, List<Long> shids);
	
	public GoodsStorehouseStockPO queryGoodsStorehouseStockByShidAGid(long gid, long cid, long fid, long shid);
	
	public Float queryGoodsStorehouseStockByGid(long gid, long cid, long fid);

}
