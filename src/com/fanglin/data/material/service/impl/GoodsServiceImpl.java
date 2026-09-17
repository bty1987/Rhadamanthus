/**
 * @File Name		: GoodsServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.dao.CategoryFormatDao;
import com.fanglin.communion.dao.ColorPoolDao;
import com.fanglin.communion.dao.DataDrawingDao;
import com.fanglin.communion.dao.FormatPoolDao;
import com.fanglin.communion.dao.GoodsPoolDao;
import com.fanglin.communion.dao.PricePoolDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryFormatPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.communion.po.ColorPoolPO;
import com.fanglin.communion.po.DataDrawingPO;
import com.fanglin.communion.po.FormatPoolPO;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.communion.po.PricePoolPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.material.dao.FormatDao;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.PriceDao;
import com.fanglin.data.material.service.GoodsService;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsKindPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.right.dao.BrandUserRightDao;
import com.fanglin.right.po.BrandUserRightPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("goodsService")
@Transactional(readOnly = true)
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandUserRightDao brandUserRightDao;

	@Autowired
	private CategoryDao categoryDao;

	@Autowired
	private CategoryFormatDao categoryFormatDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private GoodsPoolDao goodsPoolDao;

	@Autowired
	private ColorPoolDao colorPoolDao;

	@Autowired
	private FormatPoolDao formatPoolDao;

	@Autowired
	private PricePoolDao pricePoolDao;

	@Autowired
	private DataDrawingDao dataDrawingDao;

	@Autowired
	private ColorDao colorDao;

	@Autowired
	private FormatDao formatDao;

	@Autowired
	private PriceDao priceDao;

	@Override
	public void pageGoods(Paging paging, List<Filter> filters, String userId, int company, GoodsVO goods) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		List<BrandUserRightPO> brandUserRightPOs = brandUserRightDao.queryBrandUserRightByUid(userPO.getUid());

		if (goods != null && goods.getAtttype() != null) {
			filters.add(new Filter("atttype", String.valueOf(goods.getAtttype()), "eq"));
		}

		if (brandUserRightPOs.size() > 0) {

			List<Long> bids = new ArrayList<Long>();

			for (BrandUserRightPO brandUserRightPO : brandUserRightPOs) {
				Long brandIds = brandUserRightPO.getBrand().getBid();
				bids.add(brandIds);
			}

			List<GoodsPO> goodsPOs = goodsDao.pageGoods(paging, filters, bids, company);
			List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

			for (GoodsPO goodsPO : goodsPOs) {
				goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
			}

			paging.setData(goodsVOs);
		}
	}

	@Override
	public void pageGoodsForAdvance(Paging paging, List<Filter> filters, int company, GoodsVO goods) throws FLException {

		List<GoodsPO> goodsPOs = goodsDao.pageGoodsForAdvance(paging, filters, company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		if (goods != null && goods.getAtttype() != null) {
			filters.add(new Filter("atttype", String.valueOf(goods.getAtttype()), "eq"));
		}

		for (GoodsPO goodsPO : goodsPOs) {
			goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
		}

		paging.setData(goodsVOs);
	}

	@Override
	public List<GoodsVO> queryGoods(List<Filter> filters, int company) throws FLException {

		List<GoodsPO> goodsPOs = goodsDao.queryGoods(filters, company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		for (GoodsPO goodsPO : goodsPOs) {
			goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
		}

		return goodsVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByNo(GoodsVO goodsVO, int company) {

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByNo(goodsVO.getNo(), 10, company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		for (GoodsPO goodsPO : goodsPOs) {
			goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
		}

		return goodsVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByName(GoodsVO goodsVO, int company) {

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByName(goodsVO.getName(), 10, company);
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		for (GoodsPO goodsPO : goodsPOs) {
			goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
		}

		return goodsVOs;
	}

	@Override
	public List<GoodsVO> queryGoodsByAtid(GoodsVO goodsVO) {

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByAtid(goodsVO.getAccessoriesType().getAtid());
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		for (GoodsPO goodsPO : goodsPOs) {
			goodsVOs.add(goodsPO.ptv(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO())));
		}

		return goodsVOs;
	}

	@Override
	public GoodsVO queryGoodsByBarcode(GoodsVO goodsVO, int company) {

		GoodsPO goodsPO = goodsDao.queryGoodsByBarcode(goodsVO.getBarcode(), company);

		goodsVO = new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

		return goodsPO.ptv(goodsVO);
	}

	@Override
	public GoodsVO queryGoodsByGId(GoodsVO goodsVO) {

		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());

		goodsVO = new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

		return goodsPO.ptv(goodsVO);
	}

	@Override
	public List<GoodsVO> queryGoodsByGpid(GoodsVO goodsVO) {

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByGpid(goodsVO.getGpid());
		List<GoodsVO> goodsVOs = new ArrayList<GoodsVO>();

		for (GoodsPO goodsPO : goodsPOs) {

			goodsVO = new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO());

			goodsVO = goodsPO.ptv(goodsVO);

			CompanyPO company = companyDao.get(goodsPO.getCompany());

			goodsVO.setCompany(company.getName());

			goodsVOs.add(goodsVO);
		}

		return goodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addGoods(GoodsVO goodsVO, int company, String userId) throws FLException {

		if (goodsVO.getCompany() != null) {
			company = CompanyServiceImpl.decode(goodsVO.getCompany());
		}

		List<GoodsPO> goodsPOs = goodsDao.queryGoodsByName(goodsVO.getName(), company);

		if (goodsPOs.size() != 0) {
			throw new FLException(260046, "商品已存在");
		}

		// 品类已维护规格(communion.categoryformat)时,商品-整装创建的规格必须取自品类规格范围
		checkFormatInCategoryScope(goodsVO);

		GoodsPO goodsPO = new GoodsPO();

		BeanUtil.copyProperties(goodsVO, goodsPO, Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));

		if (goodsVO.getAccessoriesType() != null && goodsVO.getAccessoriesType().getAtid() != null) goodsPO.setAccessoriesType(new AccessoriesTypePO(goodsVO.getAccessoriesType().getAtid()));

		if (goodsVO.getZerokind() != null && goodsVO.getZerokind().getGkid() != null) goodsPO.setZerokind(new GoodsKindPO(goodsVO.getZerokind().getGkid()));
		if (goodsVO.getOnekind() != null && goodsVO.getOnekind().getGkid() != null) goodsPO.setOnekind(new GoodsKindPO(goodsVO.getOnekind().getGkid()));
		if (goodsVO.getTwokind() != null && goodsVO.getTwokind().getGkid() != null) goodsPO.setTwokind(new GoodsKindPO(goodsVO.getTwokind().getGkid()));
		if (goodsVO.getThrkind() != null && goodsVO.getThrkind().getGkid() != null) goodsPO.setThrkind(new GoodsKindPO(goodsVO.getThrkind().getGkid()));

		List<String> pinyins = PinYin4Util.getPinyin(goodsVO.getName());

		goodsPO.setAlias(goodsVO.getAlias());
		goodsPO.setPinyin((String) pinyins.get(0));
		goodsPO.setStatus(GoodsPO.STATUS_ENABLE_INT);
		goodsPO.setCompany(company);

		BrandPO brandPO = brandDao.get(goodsVO.getBid());
		String brandName = brandPO.getName();

		goodsPO.setBrand(brandName);

		goodsDao.save(goodsPO);

		long gid = goodsPO.getGid();

		goodsVO.setGid(gid);

		long gpid = goodsPO.getGpid();

		if (goodsVO.getColor() != null) {

			ColorPO colorPO = new ColorPO();
			colorPO.setGid(gid);
			colorPO.setName(goodsVO.getColor());
			colorPO.setStatus(ColorPO.STATUS_ENABLE_INT);

			colorDao.save(colorPO);
		}

		if (goodsVO.getFormat() != null) {

			FormatPO formatPO = new FormatPO();
			formatPO.setGid(gid);
			formatPO.setInfo(goodsVO.getFormat());
			formatPO.setStatus(FormatPO.STATUS_ENABLE_INT);

			formatDao.save(formatPO);
		}

		if (gpid == 0) return 0;

		GoodsPoolPO goodsPoolPO = goodsPoolDao.get(gpid);

		if (goodsPoolPO == null) return 0;

		if ((goodsPoolPO.getColorcascade() & GoodsPoolPO.CASCADE_YES_SHORT) > 0) { // 颜色 级联时创建商品颜色

			List<ColorPoolPO> colorPools = colorPoolDao.queryColorPoolByGpid(gpid);

			if (colorPools.size() > 0) colorDao.batchSaveColor(gid, gpid);
		}

		if ((goodsPoolPO.getFormatcascade() & GoodsPoolPO.CASCADE_YES_SHORT) > 0) { // 规格 级联时创建商品规格

			List<FormatPoolPO> formatPoolPOs = formatPoolDao.queryFormatPoolByGpid(gpid);

			if (formatPoolPOs.size() > 0) formatDao.batchSaveFormat(gid, gpid);
		}

		if ((goodsPoolPO.getPricecascade() & GoodsPoolPO.CASCADE_YES_SHORT) > 0) { // 价格 级联时创建商品价格

			List<PricePoolPO> pricePoolPOs = pricePoolDao.queryPricePoolByGpid(gpid, null);

			if (pricePoolPOs.size() > 0) priceDao.batchSavePrice(gid, gpid);
		}

		if ((goodsPoolPO.getPicturecascade() & GoodsPoolPO.CASCADE_YES_SHORT) > 0) { // 图片 级联时创建商品图片

			List<DataDrawingPO> dataDrawingPOs = dataDrawingDao.queryDataDrawing(gpid, DataDrawingPO.TYPE_GOODSPOOL_SHORT);

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (dataDrawingPOs.size() > 0) dataDrawingDao.batchSaveDataDrawing(gid, gpid, userPO.getUid());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateGoods(GoodsVO goodsVO) throws FLException {

		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		BeanUtil.copyProperties(goodsVO, goodsPO, Arrays.asList("accessoriesType", "zerokind", "onekind", "twokind", "thrkind"));

		if (goodsVO.getAccessoriesType() != null && goodsVO.getAccessoriesType().getAtid() != null) goodsPO.setAccessoriesType(new AccessoriesTypePO(goodsVO.getAccessoriesType().getAtid()));

		if (goodsVO.getZerokind() != null && goodsVO.getZerokind().getGkid() != null) goodsPO.setZerokind(new GoodsKindPO(goodsVO.getZerokind().getGkid()));
		if (goodsVO.getOnekind() != null && goodsVO.getOnekind().getGkid() != null) goodsPO.setOnekind(new GoodsKindPO(goodsVO.getOnekind().getGkid()));
		if (goodsVO.getTwokind() != null && goodsVO.getTwokind().getGkid() != null) goodsPO.setTwokind(new GoodsKindPO(goodsVO.getTwokind().getGkid()));
		if (goodsVO.getThrkind() != null && goodsVO.getThrkind().getGkid() != null) goodsPO.setThrkind(new GoodsKindPO(goodsVO.getThrkind().getGkid()));

		goodsDao.update(goodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateGoodsForStatus(GoodsVO goodsVO) throws FLException {

		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		goodsPO.setStatus(goodsVO.getStatus());

		goodsDao.update(goodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int showGoods(GoodsVO goodsVO) throws FLException {

		GoodsPO goodsPO = goodsDao.get(goodsVO.getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		goodsPO.setIsShow(goodsVO.getIsShow());

		goodsDao.update(goodsPO);

		return 0;
	}

	/**
	 * 商品创建规格范围校验:品类已维护规格(communion.categoryformat)时,规格必须取自品类规格集合;
	 * 品类未维护规格时不约束(兼容自由录入)。
	 */
	private void checkFormatInCategoryScope(GoodsVO goodsVO) throws FLException {

		if (goodsVO.getFormat() == null || "".equals(goodsVO.getFormat())) return;

		CategoryPO categoryPO = categoryDao.queryCategoryByName(goodsVO.getCategory());

		if (categoryPO == null) return;

		List<CategoryFormatPO> categoryFormatPOs = categoryFormatDao.queryCategoryFormatByCid(categoryPO.getCid());

		if (categoryFormatPOs.isEmpty()) return;

		for (CategoryFormatPO categoryFormatPO : categoryFormatPOs) {
			if (goodsVO.getFormat().equals(categoryFormatPO.getFormat())) return;
		}

		throw new FLException(200124, "规格不在品类规格范围");
	}

}
