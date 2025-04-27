package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.FormatPoolDao;
import com.fanglin.communion.po.FormatPoolPO;
import com.fanglin.communion.po.GoodsPoolPO;
import com.fanglin.communion.service.FormatPoolService;
import com.fanglin.communion.vo.FormatPoolVO;
import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("formatPoolService")
@Transactional(readOnly = true)
public class FormatPoolServiceImpl implements FormatPoolService {

	@Autowired
	private FormatPoolDao formatPoolDao;

	@Override
	public void pageFormatPool(Paging paging, List<Filter> filters) {

		List<FormatPoolPO> formatPoolPOs = formatPoolDao.pageFormatPool(paging, filters);
		List<FormatPoolVO> formatPoolVOs = new ArrayList<FormatPoolVO>();

		for (FormatPoolPO formatPoolPO : formatPoolPOs) {

			FormatPoolVO formatPoolVO = new FormatPoolVO(new GoodsPoolVO());

			formatPoolVOs.add(formatPoolPO.ptv(formatPoolVO));
		}

		paging.setData(formatPoolVOs);
	}

	@Override
	public List<FormatPoolVO> queryFormatPoolByGpid(FormatPoolVO formatPoolVO) {

		List<FormatPoolPO> formatPoolPOs = formatPoolDao.queryFormatPoolByGpid(formatPoolVO.getGoodsPool().getGpid());
		List<FormatPoolVO> formatPoolVOs = new ArrayList<FormatPoolVO>();

		for (FormatPoolPO formatPoolPO : formatPoolPOs) {

			formatPoolVO = new FormatPoolVO();

			formatPoolVOs.add(formatPoolPO.ptv(formatPoolVO));
		}

		return formatPoolVOs;
	}

	@Override
	public List<FormatPoolVO> queryFormatPoolForEnableByGpid(FormatPoolVO formatPoolVO) {

		List<FormatPoolPO> formatPoolPOs = formatPoolDao.queryFormatPoolForEnableByGpid(formatPoolVO.getGoodsPool().getGpid());
		List<FormatPoolVO> formatPoolVOs = new ArrayList<FormatPoolVO>();

		for (FormatPoolPO formatPoolPO : formatPoolPOs) {

			formatPoolVO = new FormatPoolVO();

			formatPoolVOs.add(formatPoolPO.ptv(formatPoolVO));
		}

		return formatPoolVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFormatPool(FormatPoolVO formatPoolVO) throws FLException {

		long gpid = formatPoolVO.getGoodsPool().getGpid();

		FormatPoolPO formatPoolPO = formatPoolDao.queryFormatPoolByInfo(gpid, formatPoolVO.getInfo());

		if (formatPoolPO != null) {
			throw new FLException(260035, "规格已存在");
		}

		formatPoolPO = new FormatPoolPO(new GoodsPoolPO(gpid));

		BeanUtil.copyProperties(formatPoolVO, formatPoolPO, Arrays.asList("goodsPool"));

		formatPoolDao.save(formatPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFormatPoolForStatus(FormatPoolVO formatPoolVO) throws FLException {

		FormatPoolPO formatPoolPO = formatPoolDao.get(formatPoolVO.getFpid());

		if (formatPoolPO == null) {
			throw new FLException(260015, "规格不存在");
		}

		formatPoolPO.setStatus(formatPoolVO.getStatus());

		formatPoolDao.update(formatPoolPO);

		return 0;
	}

}
