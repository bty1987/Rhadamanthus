package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface GoodsPoolDao extends Dao<GoodsPoolPO> {

	public List<GoodsPoolPO> pageGoodsPool(Paging paging, List<Filter> filters);

	public List<GoodsPoolPO> queryGoodsPool(List<Filter> filters);

	public List<GoodsPoolPO> queryGoodsPoolByName(String name, int limit);

	public List<GoodsPoolPO> queryGoodsPoolByNo(String no, int limit);

	public List<GoodsPoolPO> queryGoodsPoolByAtid(long atid);

	public List<GoodsPoolPO> queryGoodsPoolByBarcode(String barcode, int limit);

	public List<GoodsPoolPO> queryGoodsPoolByName(String name);

	public GoodsPoolPO queryGoodsPoolByNo(String no);

	public GoodsPoolPO queryGoodsPoolByBarcode(String barcode);

}
