package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.dao.SlideDao;
import com.fanglin.store.po.SlidePO;
import com.fanglin.store.service.SlideService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.SlideVO;
import com.fanglin.utils.BeanUtil;

@Service("slideService")
@Transactional(readOnly = true)
public class SlideServiceImpl implements SlideService {

	@Autowired
	private SlideDao slideDao;

	@Autowired
	private MgoodsDao mgoodsDao;

	@Override
	public List<SlideVO> querySlide() {

		List<SlidePO> slidePOs = slideDao.querySlide();

		List<SlideVO> slideVOs = new ArrayList<SlideVO>();

		SlideVO slideVO;

		for (SlidePO slidePO : slidePOs) {

			slideVO = new SlideVO(new MgoodsVO(new MbrandVO()));

			BeanUtil.copyProperties(slidePO, slideVO, Arrays.asList("mgoods"));

			if (slidePO.getMgoods() != null) {

				BeanUtil.copyProperties(slidePO.getMgoods(),slideVO.getMgoods(), Arrays.asList("mbrand"));

				BeanUtil.copyProperties(slidePO.getMgoods().getMbrand(),slideVO.getMgoods().getMbrand(),Arrays.asList("mcategory"));
			}

			slideVOs.add(slideVO);
		}
		return slideVOs;
	}

	@Override
	public List<SlideVO> querySlideByGid(SlideVO slide) {
		
		List<SlidePO> slidePOs = slideDao.querySlideByGid(slide.getMgoods().getGid());
		
		List<SlideVO> slideVOs = new ArrayList<SlideVO>();
		
		SlideVO slideVO;
		
		for(SlidePO slidePO : slidePOs){
			
			slideVO = new SlideVO(new MgoodsVO());
			
			BeanUtil.copyProperties(slidePO, slideVO, Arrays.asList("mgoods"));
			
			BeanUtil.copyProperties(slidePO.getMgoods(), slideVO.getMgoods(), Arrays.asList("mbrand"));
			
			slideVOs.add(slideVO);
			
		}
		
		return slideVOs;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSlide(SlideVO slideVO) {

		SlidePO slidePO = new SlidePO();

		slidePO.setStatus(SlidePO.STATUS_ABLE_SHORT);

		slidePO.setImg(slideVO.getImg());

		slidePO.setUrl(slideVO.getUrl());

		if (slideVO.getMgoods().getGid() != null) {
			slidePO.setMgoods(mgoodsDao.get(slideVO.getMgoods().getGid()));
		}
		slideDao.save(slidePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSlide(SlideVO slideVO) throws FLException {

		SlidePO slidePO = slideDao.get(slideVO.getSid());

		if (slidePO == null) {
			throw new FLException(111111, "轮播图片不存在");
		}

		BeanUtil.copyProperties(slideVO, slidePO,
				Arrays.asList("mgoods", "status"));

		if (slideVO.getMgoods().getGid() != null) {
			slidePO.setMgoods(mgoodsDao.get(slideVO.getMgoods().getGid()));
		}
		slideDao.update(slidePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateSlideForStatus(SlideVO slideVO) throws FLException {

		SlidePO slidePO = slideDao.get(slideVO.getSid());

		if (slidePO == null) {
			throw new FLException(111111, "轮播图片不存在");
		}

		slidePO.setStatus(slideVO.getStatus());

		slideDao.update(slidePO);
	}

}
