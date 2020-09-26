package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.SlideService;
import com.fanglin.store.vo.SlideVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SlideAction extends BaseListAction {

	private static final long serialVersionUID = -8654723547160844697L;

	@Autowired
	private SlideService slideService;

	private SlideVO slide;

	private List<SlideVO> slides;

	@Action(value = "querySlide", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySlide() {

		slides = slideService.querySlide();

		return SUCCESS;
	}

	@Action(value = "addSlide", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSlide() {

		slideService.addSlide(slide);

		return SUCCESS;
	}

	@Action(value = "updateSlide", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSlide() throws FLException {

		slideService.updateSlide(slide);

		return SUCCESS;
	}

	@Action(value = "updateSlideForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSlideForStatus() throws FLException {

		slideService.updateSlideForStatus(slide);

		return SUCCESS;
	}

	public SlideVO getSlide() {
		return slide;
	}

	public void setSlide(SlideVO slide) {
		this.slide = slide;
	}

	public List<SlideVO> getSlides() {
		return slides;
	}

	public void setSlides(List<SlideVO> slides) {
		this.slides = slides;
	}

}
