package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.SlideDao;
import com.fanglin.store.po.SlidePO;
import com.fanglin.store.service.SlideService;
import com.fanglin.store.vo.SlideVO;
import com.fanglin.utils.BeanUtil;

@Service("slideService")
@Transactional(readOnly = true)
public class SlideServiceImpl implements SlideService {

	@Autowired
	private SlideDao slideDao;

	@Override
	public List<SlideVO> querySlide() {

		List<SlidePO> slidePOs = slideDao.querySlide(false);

		List<SlideVO> slideVOs = new ArrayList<SlideVO>();

		SlideVO slideVO;

		for (SlidePO slidePO : slidePOs) {

			slideVO = new SlideVO();

			BeanUtil.copyProperties(slidePO, slideVO);

			slideVOs.add(slideVO);
			
		}
		
		return slideVOs;
		
	}

	@Override
	public List<SlideVO> querySlideForShow() {
		
		List<SlidePO> slidePOs = slideDao.querySlide(true);

		List<SlideVO> slideVOs = new ArrayList<SlideVO>();

		SlideVO slideVO;

		for (SlidePO slidePO : slidePOs) {

			slideVO = new SlideVO();

			BeanUtil.copyProperties(slidePO, slideVO);

			slideVOs.add(slideVO);
			
		}
		
		return slideVOs;
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSlide(SlideVO slideVO) {

		SlidePO slidePO = new SlidePO();

		slidePO.setStatus(SlidePO.STATUS_ABLE_SHORT);

		BeanUtil.copyProperties(slideVO, slidePO);
		
		slideDao.save(slidePO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSlide(SlideVO slideVO) throws FLException {
		
		SlidePO slidePO = slideDao.get(slideVO.getSid());

		if (slidePO == null) {
			throw new FLException(340002, "轮播图片不存在");
		}
		
		BeanUtil.copyProperties(slideVO, slidePO);
		
		if (slideVO.getGid() != 0) {
			slidePO.setGid(slideVO.getGid());
		}
		
		slideDao.update(slidePO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSlideForStatus(SlideVO slideVO) throws FLException {

		SlidePO slidePO = slideDao.get(slideVO.getSid());

		if (slidePO == null) {
			throw new FLException(340002, "轮播图片不存在");
		}

		slidePO.setStatus(slideVO.getStatus());

		slideDao.update(slidePO);
		
	}

}
