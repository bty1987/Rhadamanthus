package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.material.service.ColorService;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.ColorGO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("colorService")
@Transactional(readOnly = true)
public class ColorServiceImpl implements ColorService {

	@Autowired
	private ColorDao colorDao;

	@Override
	public void pageColor(Paging paging, List<Filter> filters, int company) {

		List<ColorGO> colorGOs = colorDao.pageColor(paging, filters, company);
		List<ColorVO> colorVOs = new ArrayList<ColorVO>();

		for (ColorGO colorGO : colorGOs) {

			ColorVO colorVO = new ColorVO(new GoodsVO());

			BeanUtil.copyProperties(colorGO, colorVO, Arrays.asList("goods"));
			colorGO.getGoods().ptv(colorVO.getGoods());

			colorVOs.add(colorVO);
		}

		paging.setData(colorVOs);
	}

	@Override
	public List<ColorVO> queryColorByGid(ColorVO colorVO) {

		List<ColorPO> colorPOs = colorDao.queryColorByGid(colorVO.getGid());
		List<ColorVO> colorVOs = new ArrayList<ColorVO>();

		for (ColorPO colorPO : colorPOs) {

			colorVO = new ColorVO();

			BeanUtil.copyProperties(colorPO, colorVO);

			colorVOs.add(colorVO);
		}

		return colorVOs;
	}

	@Override
	public List<ColorVO> queryColorForEnableByGid(ColorVO colorVO) {

		List<ColorPO> colorPOs = colorDao.queryColorForEnableByGid(colorVO.getGid());
		List<ColorVO> colorVOs = new ArrayList<ColorVO>();

		for (ColorPO colorPO : colorPOs) {

			colorVO = new ColorVO();

			BeanUtil.copyProperties(colorPO, colorVO);

			colorVOs.add(colorVO);
		}

		return colorVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addColor(ColorVO colorVO) throws FLException {

		ColorPO colorPO = colorDao.queryColorByName(colorVO.getGid(), colorVO.getName());

		if (colorPO != null) {
			throw new FLException(260034, "颜色已存在");
		}

		colorPO = new ColorPO();

		BeanUtil.copyProperties(colorVO, colorPO);

		colorPO.setStatus(ColorPO.STATUS_ENABLE_INT);

		colorDao.save(colorPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updataColorForStatus(ColorVO colorVO) throws FLException {

		ColorPO colorPO = colorDao.get(colorVO.getCid());

		if (colorPO == null) {
			throw new FLException(260014, "颜色不存在");
		}

		colorPO.setStatus(colorVO.getStatus());

		colorDao.update(colorPO);

		return 0;
	}

}
