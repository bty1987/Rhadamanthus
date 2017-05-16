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

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.utils.Paging;

public interface GoodsDao extends Dao<GoodsPO>{
	
	public List<GoodsPO> pageGoods(Paging paging, List<Filter> filters);
	
	public List<GoodsPO> queryGoods(List<Filter> filters);
	
	public List<GoodsPO> queryGoodsByName(String name,String pinyin,String no, int limit);
	
	public List<GoodsPO> queryGoodsByNo(String no, int limit);
	
	public List<GoodsPO> queryGoodsByBarcode(String barcode, int limit);
	
	public List<GoodsPO> queryGoodsByAtid(long atid);
	
	public GoodsPO queryGoodsByName(String name);
	
	public GoodsPO queryGoodsByNo(String no);
	
	public GoodsPO queryGoodsByBarcode(String barcode);
	
}
