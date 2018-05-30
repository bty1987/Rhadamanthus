package com.fanglin.store.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.SlideVO;

public interface SlideService {
	
	public List<SlideVO> querySlide();
	
	public List<SlideVO> querySlideByGid(SlideVO slideVO);
	
	public void addSlide(SlideVO slideVO);
	
	public void updateSlide(SlideVO slideVO)throws FLException;
	
	public void updateSlideForStatus(SlideVO slideVO)throws FLException;
	
}
