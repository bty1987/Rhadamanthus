package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.PricePoolDao;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.communion.po.PricePoolPO;
import com.fanglin.communion.service.PricePoolService;
import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.communion.vo.PricePoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("pricePoolService")
@Transactional(readOnly = true)
public class PricePoolServiceImpl implements PricePoolService {

	@Autowired
	private PricePoolDao pricePoolDao;

	@Override
	public void pagePricePool(Paging paging, List<Filter> filters) {

		List<PricePoolPO> pricePoolPOs = pricePoolDao.pagePricePool(paging, filters);
		List<PricePoolVO> pricePoolVOs = new ArrayList<PricePoolVO>();

		for (PricePoolPO pricePoolPO : pricePoolPOs) {

			PricePoolVO pricePoolVO = new PricePoolVO(new GoodsPoolVO());

			pricePoolVOs.add(pricePoolPO.ptv(pricePoolVO));
		}

		paging.setData(pricePoolVOs);
	}

	@Override
	public List<PricePoolVO> queryPricePoolByGpid(PricePoolVO pricePoolVO) {

		List<PricePoolPO> pricePoolPOs = pricePoolDao.queryPricePoolByGpid(pricePoolVO.getGoodsPool().getGpid(), pricePoolVO.getStatus());
		List<PricePoolVO> pricePoolVOs = new ArrayList<PricePoolVO>();

		for (PricePoolPO pricePoolPO : pricePoolPOs) {

			pricePoolVO = new PricePoolVO(new GoodsPoolVO());

			String content = pricePoolPO.getSelling() + " " + pricePoolPO.getName();

			pricePoolVO = pricePoolPO.ptv(pricePoolVO);

			pricePoolVO.setContent(content);

			pricePoolVOs.add(pricePoolVO);
		}

		return pricePoolVOs;
	}

	@Override
	public PricePoolVO queryPricePoolByPpid(PricePoolVO pricePool) {

		PricePoolPO pricePoolPO = pricePoolDao.queryPricePoolByPpid(pricePool.getPpid());

		PricePoolVO pricePoolVO = new PricePoolVO(new GoodsPoolVO());

		return pricePoolPO.ptv(pricePoolVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPricePool(PricePoolVO pricePoolVO) throws FLException {

		long gpid = pricePoolVO.getGoodsPool().getGpid();

		PricePoolPO pricePoolPO = new PricePoolPO(new GoodsPoolPO(gpid));

		BeanUtil.copyProperties(pricePoolVO, pricePoolPO, Arrays.asList("goodsPool"));

		pricePoolDao.save(pricePoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePricePoolForStatus(PricePoolVO pricePoolVO) throws FLException {

		PricePoolPO pricePoolPO = pricePoolDao.get(pricePoolVO.getPpid());

		if (pricePoolPO == null) {
			throw new FLException(260016, "价格不存在");
		}

		pricePoolPO.setStatus(pricePoolVO.getStatus());

		pricePoolDao.update(pricePoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePricePool(PricePoolVO pricePoolVO) throws FLException {

		PricePoolPO pricePoolPO = pricePoolDao.get(pricePoolVO.getPpid());

		if (pricePoolPO == null) {
			throw new FLException(260016, "价格不存在");
		}

		pricePoolDao.delete(pricePoolPO);

		return 0;
	}

}
