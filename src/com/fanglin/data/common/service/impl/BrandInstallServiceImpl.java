package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.BrandInstallDao;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.service.BrandInstallService;
import com.fanglin.data.common.vo.BrandInstallVO;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.BrandInstallPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.BeanUtil;

@Service("BrandInstallService")
@Transactional(readOnly = true)
public class BrandInstallServiceImpl implements BrandInstallService {

	@Autowired
	private BrandInstallDao brandInstallDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public List<BrandInstallVO> queryBrandInstall(BrandInstallVO brandInstallVO) {

		List<BrandInstallPO> brandInstallPOs = brandInstallDao.queryBrandInstall(brandInstallVO.getBrand().getBid());
		List<BrandInstallVO> brandInstallVOs = new ArrayList<BrandInstallVO>();

		for (BrandInstallPO brandInstallPO : brandInstallPOs) {
			brandInstallVOs.add(brandInstallPO.ptv(new BrandInstallVO(new BrandVO(), new ConstructionNodeVO())));
		}

		return brandInstallVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandInstall(BrandInstallVO brandInstallVO) throws FLException {

		if (brandInstallVO.getBrand() == null) {
			throw new FLException(130077, "品牌不存在");
		}

		BrandPO brandPO = brandDao.get(brandInstallVO.getBrand().getBid());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		if (brandInstallVO.getConstructionNode() == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(brandInstallVO.getConstructionNode().getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		BrandInstallPO brandInstallPO = new BrandInstallPO();

		BeanUtil.copyProperties(brandInstallVO, brandInstallPO, Arrays.asList("constructionNode", "brand"));

		brandInstallPO.setBrand(brandPO);
		brandInstallPO.setConstructionNode(constructionNodePO);

		brandInstallDao.save(brandInstallPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBrandInstall(BrandInstallVO brandInstall) throws FLException {

		BrandInstallPO brandInstallPO = brandInstallDao.get(brandInstall.getBiid());

		if (brandInstallPO == null) {
			throw new FLException(130147, "品牌生产信息不存在");
		}

		if (brandInstall.getConstructionNode() != null) {
			brandInstallPO.setConstructionNode(new ConstructionNodePO(brandInstall.getConstructionNode().getCnid()));
		}

		if (brandInstall.getComment() != null) {
			brandInstallPO.setComment(brandInstall.getComment());
		}

		if (brandInstall.getWorkNum() != null) {
			brandInstallPO.setWorkNum(brandInstall.getWorkNum());
		}

		if (brandInstall.getName() != null) {
			brandInstallPO.setName(brandInstall.getName());
		}

		brandInstallDao.update(brandInstallPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandInstall(BrandInstallVO brandInstall) throws FLException {

		BrandInstallPO brandInstallPO = brandInstallDao.get(brandInstall.getBiid());

		brandInstallDao.delete(brandInstallPO);
	}

}
