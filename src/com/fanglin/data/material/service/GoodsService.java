/**
 * @File Name		: GoodsService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.utils.Paging;

public interface GoodsService {

	public void pageGoods(Paging paging, List<Filter> filters, String userId, int company, GoodsVO goods) throws FLException;

	public void pageGoodsForAdvance(Paging paging, List<Filter> filters, int company, GoodsVO goods) throws FLException;

	public List<GoodsVO> queryGoods(List<Filter> filters, int company) throws FLException;

	public List<GoodsVO> queryGoodsByNo(GoodsVO goodsVO, int company);

	/**
	 * 按名称模糊查商品: userId非空=按该用户品牌权限过滤(无品牌权限空列表fail-closed), null=共用入口不过滤品牌
	 */
	public List<GoodsVO> queryGoodsByName(GoodsVO goodsVO, String userId, int company);



	public List<GoodsVO> queryGoodsByAtid(GoodsVO goodsVO);

	public GoodsVO queryGoodsByBarcode(GoodsVO goodsVO, int company);

	public GoodsVO queryGoodsByGId(GoodsVO goodsVO);

	public List<GoodsVO> queryGoodsByGpid(GoodsVO goods);

	public int addGoods(GoodsVO goodsVO, int company, String userId) throws FLException;

	public int updateGoods(GoodsVO goodsVO) throws FLException;

	public int updateGoodsForStatus(GoodsVO goodsVO) throws FLException;

	public int showGoods(GoodsVO goodsVO) throws FLException;

}
