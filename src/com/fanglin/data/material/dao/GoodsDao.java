/**
 * @File Name		: GoodsDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.utils.Paging;

public interface GoodsDao extends Dao<GoodsPO> {

	public List<GoodsPO> pageGoods(Paging paging, List<Filter> filters, List<Long> bids, int company);

	public List<GoodsPO> pageGoodsForAdvance(Paging paging, List<Filter> filters, int company);

	public List<GoodsPO> queryGoods(List<Filter> filters, int company);

	public List<GoodsPO> queryGoodsByName(String name,int limit, int company);

	public List<GoodsPO> queryGoodsByNo(String no, int limit, int company);
	
	public List<GoodsPO> queryGoodsByAtid(long atid);

	public List<GoodsPO> queryGoodsByBarcode(String barcode, int limit, int company);

	public List<GoodsPO> queryGoodsByName(String name, int company);

	public GoodsPO queryGoodsByNo(String no, int company);

	public GoodsPO queryGoodsByBarcode(String barcode, int company);

}
