package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ColorPoolDao;
import com.fanglin.communion.po.ColorPoolPO;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.communion.service.ColorPoolService;
import com.fanglin.communion.vo.ColorPoolVO;
import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("colorPoolService")
@Transactional(readOnly = true)
public class ColorPoolServiceImpl implements ColorPoolService {

	@Autowired
	private ColorPoolDao colorPoolDao;

	@Override
	public void pageColorPool(Paging paging, List<Filter> filters) {

		List<ColorPoolPO> colorPoolPOs = colorPoolDao.pageColorPool(paging, filters);
		List<ColorPoolVO> colorPoolVOs = new ArrayList<ColorPoolVO>();

		for (ColorPoolPO colorPoolPO : colorPoolPOs) {

			ColorPoolVO colorPoolVO = new ColorPoolVO(new GoodsPoolVO());

			colorPoolVOs.add(colorPoolPO.ptv(colorPoolVO));
		}

		paging.setData(colorPoolVOs);
	}

	@Override
	public List<ColorPoolVO> queryColorPoolByGpid(ColorPoolVO colorPoolVO) {

		List<ColorPoolPO> colorPoolPOs = colorPoolDao.queryColorPoolByGpid(colorPoolVO.getGoodsPool().getGpid());
		List<ColorPoolVO> colorPoolVOs = new ArrayList<ColorPoolVO>();

		for (ColorPoolPO colorPoolPO : colorPoolPOs) {

			colorPoolVO = new ColorPoolVO();

			colorPoolVOs.add(colorPoolPO.ptv(colorPoolVO));
		}

		return colorPoolVOs;
	}

	@Override
	public List<ColorPoolVO> queryColorPoolForEnableByGpid(ColorPoolVO colorPoolVO) {

		List<ColorPoolPO> colorPoolPOs = colorPoolDao.queryColorPoolForEnableByGpid(colorPoolVO.getGoodsPool().getGpid());
		List<ColorPoolVO> colorPoolVOs = new ArrayList<ColorPoolVO>();

		for (ColorPoolPO colorPoolPO : colorPoolPOs) {

			colorPoolVO = new ColorPoolVO();

			colorPoolVOs.add(colorPoolPO.ptv(colorPoolVO));
		}

		return colorPoolVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addColorPool(ColorPoolVO colorPoolVO) throws FLException {

		long gpid = colorPoolVO.getGoodsPool().getGpid();

		ColorPoolPO colorPoolPO = colorPoolDao.queryColorPoolByName(gpid, colorPoolVO.getName());

		if (colorPoolPO != null) {
			throw new FLException(260034, "颜色已存在");
		}

		colorPoolPO = new ColorPoolPO(new GoodsPoolPO(gpid));

		BeanUtil.copyProperties(colorPoolVO, colorPoolPO, Arrays.asList("goodsPool"));

		colorPoolDao.save(colorPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updataColorPoolForStatus(ColorPoolVO colorPoolVO) throws FLException {

		ColorPoolPO colorPoolPO = colorPoolDao.get(colorPoolVO.getCpid());

		if (colorPoolPO == null) {
			throw new FLException(260014, "颜色不存在");
		}

		colorPoolPO.setStatus(colorPoolVO.getStatus());

		colorPoolDao.update(colorPoolPO);

		return 0;
	}

}
