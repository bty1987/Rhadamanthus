package com.fanglin.communion.action;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("common")
@Namespace("/")
@Controller
public class CommunionCommonAction extends BaseListAction {

	private static final long serialVersionUID = -2218803921837474715L;

}
