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
import com.fanglin.data.common.dao.BrandProductDao;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.service.BrandProductService;
import com.fanglin.data.common.vo.BrandProductVO;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.BrandProductPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.BeanUtil;

@Service("BrandProductService")
@Transactional(readOnly = true)
public class BrandProductServiceImpl implements BrandProductService {

	@Autowired
	private BrandProductDao brandProductDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public List<BrandProductVO> queryBrandProduct(BrandProductVO brandProductVO) {

		List<BrandProductPO> brandProductPOs = brandProductDao.queryBrandProduct(brandProductVO.getBrand().getBid());
		List<BrandProductVO> brandProductVOs = new ArrayList<BrandProductVO>();

		for (BrandProductPO brandProductPO : brandProductPOs) {

			brandProductVOs.add(brandProductPO.ptv(new BrandProductVO(new BrandVO(),new ConstructionNodeVO())));

		}
		return brandProductVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandProduct(BrandProductVO brandProductVO) throws FLException {

		if (brandProductVO.getBrand() == null) {
			throw new FLException(130077, "品牌不存在");
		}

		BrandPO brandPO = brandDao.get(brandProductVO.getBrand().getBid());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		if (brandProductVO.getConstructionNode() == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(brandProductVO.getConstructionNode().getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		BrandProductPO brandProductPO = new BrandProductPO();

		BeanUtil.copyProperties(brandProductVO, brandProductPO, Arrays.asList("constructionNode", "brand"));

		brandProductPO.setBrand(brandPO);
		brandProductPO.setConstructionNode(constructionNodePO);

		brandProductDao.save(brandProductPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBrandProduct(BrandProductVO brandProduct) throws FLException {

		BrandProductPO brandProductPO = brandProductDao.get(brandProduct.getBpid());

		if (brandProductPO == null) {
			throw new FLException(130147, "品牌生产信息不存在");
		}

		if (brandProduct.getConstructionNode() != null) {
			brandProductPO.setConstructionNode(new ConstructionNodePO(brandProduct.getConstructionNode().getCnid()));
		}

		if (brandProduct.getComment() != null) {
			brandProductPO.setComment(brandProduct.getComment());
		}

		if (brandProduct.getWorkNum() != null) {
			brandProductPO.setWorkNum(brandProduct.getWorkNum());
		}

		if (brandProduct.getName() != null) {
			brandProductPO.setName(brandProduct.getName());
		}

		brandProductDao.update(brandProductPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandProduct(BrandProductVO brandProduct) throws FLException {

		BrandProductPO brandProductPO = brandProductDao.get(brandProduct.getBpid());

		brandProductDao.delete(brandProductPO);
	}

}
