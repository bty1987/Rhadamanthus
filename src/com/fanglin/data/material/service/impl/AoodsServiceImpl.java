package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.material.dao.AoodsDao;
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
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

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

	@Override
	public void pageAoods(Paging paging, List<Filter> filters, int company, String companyType) throws FLException {

		List<AoodsPO> AoodsPOs = aoodsDao.pageAoods(paging, filters, company, companyType);
		List<AoodsVO> AoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : AoodsPOs) {

			AoodsVO aoodsVO = new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO());

			BeanUtil.copyProperties(aoodsPO, aoodsVO, Arrays.asList("goods", "accessoriesType", "bompany", "noods", "constructionNode"));
			BeanUtil.copyProperties(aoodsPO.getGoods(), aoodsVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(aoodsPO.getAccessoriesType(), aoodsVO.getAccessoriesType(), Arrays.asList("workType"));
			BeanUtil.copyProperties(aoodsPO.getNoods(), aoodsVO.getNoods());
			BeanUtil.copyProperties(aoodsPO.getConstructionNode(), aoodsVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			if (aoodsPO.getBompany() != 0) {

				CompanyPO companyPO = companyDao.get(aoodsPO.getBompany());

				aoodsVO.setBompany(companyPO.getName());
			}

			AoodsVOs.add(aoodsVO);
		}

		paging.setData(AoodsVOs);
	}

	@Override
	public List<AoodsVO> queryAoods(AoodsVO aoodsVO, String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<AoodsPO> aoodsPOs = aoodsDao.queryAoods(aoodsVO.getAccessoriesType().getAtid(), aoodsVO.getAtttype(), decorationPO.getCompany());
		List<AoodsVO> AoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : aoodsPOs) {

			aoodsVO = new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO());

			BeanUtil.copyProperties(aoodsPO, aoodsVO, Arrays.asList("goods", "accessoriesType", "bompany", "noods", "constructionNode"));

			aoodsVO.setGid(aoodsPO.getGoods().getGid());
			aoodsVO.setName(aoodsPO.getGoods().getName());

			BeanUtil.copyProperties(aoodsPO.getGoods(), aoodsVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(aoodsPO.getAccessoriesType(), aoodsVO.getAccessoriesType(), Arrays.asList("workType"));
			BeanUtil.copyProperties(aoodsPO.getNoods(), aoodsVO.getNoods());
			BeanUtil.copyProperties(aoodsPO.getConstructionNode(), aoodsVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			AoodsVOs.add(aoodsVO);
		}

		return AoodsVOs;
	}

	@Override
	public List<AoodsVO> queryAoodsByAtid(AoodsVO aoodsVO, String orderId) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<AoodsPO> aoodsPOs = aoodsDao.queryAoodsByAtid(aoodsVO.getAccessoriesType().getAtid(), decorationPO.getCompany());
		List<AoodsVO> AoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : aoodsPOs) {

			aoodsVO = new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO());

			BeanUtil.copyProperties(aoodsPO, aoodsVO, Arrays.asList("goods", "accessoriesType", "bompany", "noods", "constructionNode"));

			aoodsVO.setGid(aoodsPO.getGoods().getGid());
			aoodsVO.setName(aoodsPO.getGoods().getName());

			BeanUtil.copyProperties(aoodsPO.getGoods(), aoodsVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(aoodsPO.getAccessoriesType(), aoodsVO.getAccessoriesType(), Arrays.asList("workType"));
			BeanUtil.copyProperties(aoodsPO.getNoods(), aoodsVO.getNoods());
			BeanUtil.copyProperties(aoodsPO.getConstructionNode(), aoodsVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			AoodsVOs.add(aoodsVO);
		}

		return AoodsVOs;
	}

	@Override
	public List<AoodsVO> queryAoodsByName(AoodsVO aoodsVO, int company) {

		List<AoodsPO> AoodsPOs = aoodsDao.queryAoodsByName(aoodsVO.getGoods().getName(), 10, company);
		List<AoodsVO> AoodsVOs = new ArrayList<AoodsVO>();

		for (AoodsPO aoodsPO : AoodsPOs) {

			aoodsVO = new AoodsVO(new GoodsVO(), new AccessoriesTypeVO(), new NoodsVO(), new ConstructionNodeVO());

			BeanUtil.copyProperties(aoodsPO, aoodsVO, Arrays.asList("goods", "accessoriesType", "bompany", "noods", "constructionNode"));

			aoodsVO.setGid(aoodsPO.getGoods().getGid());
			aoodsVO.setName(aoodsPO.getGoods().getName());

			BeanUtil.copyProperties(aoodsPO.getGoods(), aoodsVO.getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(aoodsPO.getAccessoriesType(), aoodsVO.getAccessoriesType(), Arrays.asList("workType"));
			BeanUtil.copyProperties(aoodsPO.getNoods(), aoodsVO.getNoods());
			BeanUtil.copyProperties(aoodsPO.getConstructionNode(), aoodsVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			AoodsVOs.add(aoodsVO);
		}

		return AoodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAoods(AoodsVO aoodsVO, int company) throws FLException {

		AoodsPO aoodsPO = new AoodsPO();

		int cid = "".equals(aoodsVO.getBompany()) ? 0 : CompanyServiceImpl.decode(aoodsVO.getBompany());

		if (aoodsDao.countAoods(aoodsVO.getGoods().getGid(), cid) > 0) {
			throw new FLException(130029, "辅材已存在");
		}

		aoodsPO.setName(aoodsVO.getName());
		aoodsPO.setGoods(new GoodsPO(aoodsVO.getGoods().getGid()));
		aoodsPO.setAccessoriesType(new AccessoriesTypePO(aoodsVO.getAccessoriesType().getAtid()));
		aoodsPO.setStatus(AoodsPO.STATUS_ENABLE_INT);
		aoodsPO.setCheckup(AoodsPO.CHECKUP_CHECK_INT);

		aoodsPO.setAtttype(aoodsVO.getAtttype());
		aoodsPO.setBalance(aoodsVO.getBalance());
		aoodsPO.setSelling(aoodsVO.getSelling());

		aoodsPO.setCompany(company);
		aoodsPO.setBompany(cid);

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
		aoodsPO.setAccessoriesType(new AccessoriesTypePO(aoodsVO.getAccessoriesType().getAtid()));

		aoodsPO.setAtttype(aoodsVO.getAtttype());
		aoodsPO.setBalance(aoodsVO.getBalance());
		aoodsPO.setSelling(aoodsVO.getSelling());

		aoodsPO.setBompany(cid);

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
	public int copyAoods(AoodsVO aoodsVO, int company) throws FLException {

		int bompany = CompanyServiceImpl.decode(aoodsVO.getBompany());

		if (aoodsDao.countAoods(company) > 0) {
			throw new FLException(130029, "辅材已存在");
		}

		aoodsDao.copyAoods(bompany, company);

		return 0;
	}

}
