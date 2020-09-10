/**
 * @File Name		: EventsAction.java
 * @Package   	: com.fanglin.information.action
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.action;

import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.EventsService;
import com.fanglin.information.vo.EventsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EventsAction extends BaseListAction {

	private static final long serialVersionUID = -5326189050176199237L;

	@Autowired
	private EventsService eventsService;

	private List<EventsVO> events;

	private EventsVO event;

	@Action(value = "queryEvent", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEvent() throws HibernateException, ParseException, FLException {

		events = eventsService.queryEvents(event, queryUserId());

		return SUCCESS;
	}

	@Action(value = "addEvent", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEvents() throws ParseException, FLException {

		eventsService.addEvents(event, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteEvent", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteEvent() throws FLException {

		eventsService.deleteEvents(event, queryUserId());

		return SUCCESS;
	}

	public List<EventsVO> getEvents() {
		return events;
	}

	public void setEvents(List<EventsVO> events) {
		this.events = events;
	}

	public EventsVO getEvent() {
		return event;
	}

	public void setEvent(EventsVO event) {
		this.event = event;
	}

}
