package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.material.dao.AoodsDao;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.service.AoodsService;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.AccessoriesTypePO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.OrganizationDao;
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("aoodsService")
@Transactional(readOnly = true)
public class AoodsServiceImpl implements AoodsService {

	@Autowired
	private AoodsDao aoodsDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private OrganizationDao organizationDao;

	@Override
	public void pageAoods(Paging paging, List<Filter> filters, int company, String companyType) throws FLException {

		List<AoodsPO> AoodsPOs = aoodsDao.pageAoods(paging, filters, company, companyType);
		List<AoodsVO> AoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : AoodsPOs) {

			AoodsVO aoodsVO = aoodsPO.ptv(new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO()));

			if (aoodsPO.getBompany() != 0) {
				aoodsVO.setBompany(companyDao.get(aoodsPO.getBompany()).getName());
			}

			AoodsVOs.add(aoodsVO);
		}

		paging.setData(AoodsVOs);
	}

	@Override
	public List<AoodsVO> queryAoods(AoodsVO aoodsVO, String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<AoodsPO> aoodsPOs = aoodsDao.queryAoods(aoodsVO.getAccessoriesType().getAtid(), aoodsVO.getSortType().getAtid(), aoodsVO.getAtttype(), decorationPO.getCompany());
		List<AoodsVO> aoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : aoodsPOs) {
			aoodsVOs.add(aoodsPO.ptv(new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO())));
		}

		return aoodsVOs;
	}

	@Override
	public List<AoodsVO> queryAoodsByAtid(AoodsVO aoodsVO, String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<AoodsPO> aoodsPOs = aoodsDao.queryAoodsByAtid(aoodsVO.getAccessoriesType().getAtid(), decorationPO.getCompany());
		List<AoodsVO> aoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : aoodsPOs) {
			aoodsVOs.add(aoodsPO.ptv(new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO())));
		}

		return aoodsVOs;
	}

	@Override
	public List<AoodsVO> queryAoodsByName(AoodsVO aoodsVO, int company) {

		List<AoodsPO> aoodsPOs = aoodsDao.queryAoodsByName(aoodsVO.getGoods().getName(), 10, company);
		List<AoodsVO> aoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : aoodsPOs) {
			aoodsVOs.add(aoodsPO.ptv(new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO())));
		}

		return aoodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAoods(AoodsVO aoodsVO, int company) throws FLException {

		if (aoodsVO.getGoods() == null) {
			throw new FLException(260004, "商品不存在");
		}

		AoodsPO aoodsPO = new AoodsPO();

		int cid = "".equals(aoodsVO.getBompany()) ? 0 : CompanyServiceImpl.decode(aoodsVO.getBompany());

		if (aoodsDao.countAoods(aoodsVO.getGoods().getGid(), cid) > 0) {
			throw new FLException(130029, "辅材已存在");
		}

		BeanUtil.copyProperties(aoodsVO, aoodsPO, "goods", "accessoriesType", "constructionNode", "noods");

		aoodsPO.setStatus(AoodsPO.STATUS_ENABLE_INT);
		aoodsPO.setCheckup(AoodsPO.CHECKUP_CHECK_INT);

		aoodsPO.setCompany(company);
		aoodsPO.setBompany(cid);

		aoodsPO.setGoods(new GoodsPO(aoodsVO.getGoods().getGid()));

		if (aoodsVO.getAccessoriesType() != null && aoodsVO.getAccessoriesType().getAtid() != null) aoodsPO.setAccessoriesType(new AccessoriesTypePO(aoodsVO.getAccessoriesType().getAtid()));
		if (aoodsVO.getSortType() != null && aoodsVO.getSortType().getAtid() != null) aoodsPO.setSortType(new AccessoriesTypePO(aoodsVO.getSortType().getAtid()));
		if (aoodsVO.getConstructionNode() != null && aoodsVO.getConstructionNode().getCnid() != null) aoodsPO.setConstructionNode(new ConstructionNodePO(aoodsVO.getConstructionNode().getCnid()));
		if (aoodsVO.getNoods() != null && aoodsVO.getNoods().getNid() != null) aoodsPO.setNoods(new NoodsPO(aoodsVO.getNoods().getNid()));

		aoodsDao.save(aoodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAoods(AoodsVO aoodsVO) throws FLException {

		AoodsPO aoodsPO = aoodsDao.get(aoodsVO.getAid());

		if (aoodsPO == null) {
			throw new FLException(260056, "辅材不存在");
		}

		int cid = "".equals(aoodsVO.getBompany()) ? 0 : CompanyServiceImpl.decode(aoodsVO.getBompany());

		if (aoodsPO.getBompany() != cid && aoodsDao.countAoods(aoodsVO.getGoods().getGid(), cid) > 0) {
			throw new FLException(130029, "辅材已存在");
		}

		aoodsPO.setName(aoodsVO.getName());

		aoodsPO.setAtttype(aoodsVO.getAtttype());
		aoodsPO.setBalance(aoodsVO.getBalance());
		aoodsPO.setSelling(aoodsVO.getSelling());

		aoodsPO.setNormnum(aoodsVO.getNormnum());
		aoodsPO.setNormunit(aoodsVO.getNormunit());
		aoodsPO.setStorenum(aoodsVO.getStorenum());
		aoodsPO.setStoreunit(aoodsVO.getStoreunit());

		aoodsPO.setBompany(cid);

		if (aoodsVO.getAccessoriesType() != null && aoodsVO.getAccessoriesType().getAtid() != null) aoodsPO.setAccessoriesType(new AccessoriesTypePO(aoodsVO.getAccessoriesType().getAtid()));
		if (aoodsVO.getSortType() != null && aoodsVO.getSortType().getAtid() != null) aoodsPO.setSortType(new AccessoriesTypePO(aoodsVO.getSortType().getAtid()));

		if (aoodsVO.getConstructionNode() != null && aoodsVO.getConstructionNode().getCnid() == null) {
			aoodsPO.setConstructionNode(null);
		}

		if (aoodsVO.getConstructionNode() != null && aoodsVO.getConstructionNode().getCnid() != null) {
			aoodsPO.setConstructionNode(new ConstructionNodePO(aoodsVO.getConstructionNode().getCnid()));
		}

		if (aoodsVO.getNoods() != null && aoodsVO.getNoods().getNid() == null) {
			aoodsPO.setNoods(null);
		}

		if (aoodsVO.getNoods() != null && aoodsVO.getNoods().getNid() != null) {
			aoodsPO.setNoods(new NoodsPO(aoodsVO.getNoods().getNid()));
		}

		aoodsDao.update(aoodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAoodsForStatus(AoodsVO aoodsVO) throws FLException {

		AoodsPO aoodsPO = aoodsDao.get(aoodsVO.getAid());

		if (aoodsPO == null) {
			throw new FLException(260056, "辅材不存在");
		}

		aoodsPO.setStatus(aoodsVO.getStatus());

		aoodsDao.update(aoodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAoodsForNorm(AoodsVO aoodsVO) throws FLException {

		AoodsPO aoodsPO = aoodsDao.get(aoodsVO.getAid());

		if (aoodsPO == null) {
			throw new FLException(260056, "辅材不存在");
		}

		NoodsPO noodsPO = noodsDao.get(aoodsVO.getNoods().getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		aoodsPO.setNoods(noodsPO);

		aoodsDao.update(aoodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateKaoods(AoodsVO aoodsVO, GoodsVO goodsVO) throws FLException {

		OrganizationPO organizationPO = organizationDao.queryOrganization(aoodsVO.getBompany());

		if (organizationPO == null) {
			throw new FLException(230026, "组织不存在");
		}

		int cid = organizationPO.getCompany();

		BrandPO brandPO = brandDao.queryBrand(goodsVO.getBrand());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		List<String> pinyins = PinYin4Util.getPinyin(goodsVO.getName());

		GoodsPO goodsPO = goodsDao.queryGoodsByNo(goodsVO.getNo(), cid);

		if (goodsPO == null) goodsPO = new GoodsPO();

		BeanUtil.copyProperties(goodsVO, goodsPO, Arrays.asList("accessoriesType", "onekind", "twokind", "thrkind"));

		goodsPO.setAlias(goodsVO.getName());
		goodsPO.setPinyin((String) pinyins.get(0));
		goodsPO.setCompany(cid);
		goodsPO.setBrand(brandPO.getName());
		goodsPO.setBid(brandPO.getBid());
		goodsPO.setCategory(brandPO.getCategory().getName());
		goodsPO.setBarcode("");

		goodsDao.saveOrUpdate(goodsPO);

		AoodsPO aoodsPO = aoodsDao.queryAoods(goodsPO.getGid(), cid); // gid+bompany

		if (aoodsPO == null) aoodsPO = new AoodsPO();

		aoodsPO.setName(goodsVO.getName());
		aoodsPO.setGoods(goodsPO);
		aoodsPO.setStatus(goodsVO.getStatus());
		aoodsPO.setCompany(cid);
		aoodsPO.setBompany(cid);

		aoodsDao.saveOrUpdate(aoodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copyAoods(AoodsVO aoodsVO, int company) throws FLException {

		int bompany = CompanyServiceImpl.decode(aoodsVO.getBompany());

		if (aoodsDao.countAoods(company) > 0) {
			throw new FLException(130029, "辅材已存在");
		}

		aoodsDao.copyAoods(bompany, company);

		return 0;
	}

}
