/**
 * @File Name		: DDApi.java
 * @Package   	: com.fanglin.dingding.utils
 * @Version		: 1.0
 * @Date			: 2015-11-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.utils;

public interface DDApi {

	public static final String DDAPI_GET_TOKEN_STR = "%s/queryDAccessTokenForNew.do?company=%s";

	public static final String DDAPI_GET_JSAPI_TICKET_STR = "%s/queryDJsapiTicketForNew.do?company=%s";

	public static final String DDAPI_SIGN_STR = "jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s";

	public static final String DDAPI_DING_SEND_STR = "%s/v1.0/robot/ding/send";
	public static final String DDAPI_MESSAGE_SEND_STR = "%s/message/send?access_token=%s";
	public static final String DDAPI_ROBOT_SEND_STR = "%s/robot/send?access_token=%s";

	public static final String DDAPI_GET_USER_INFO_STR = "%s/user/getuserinfo?access_token=%s&code=%s";

	public static final String DDAPI_GET_USER_STR = "%s/user/get?access_token=%s&userid=%s";

	public static final String DDAPI_ADD_USER_STR = "%s/user/create?access_token=%s";// post

	public static final String DDAPI_LIST_DEPARTMENT_STR = "%s/department/list?access_token=%s&id=%s";

	public static final String DDAPI_QUERY_GROUP_STR = "%s/chat/get?access_token=%s&chatid=%s"; // get
	public static final String DDAPI_CREATE_GROUP_STR = "%s/chat/create?access_token=%s"; // post
	public static final String DDAPI_UPDATE_GROUP_STR = "%s/chat/update?access_token=%s"; // post
	public static final String DDAPI_SEND_GROUP_STR = "%s/chat/send?access_token=%s"; // post
	public static final String DDAPI_TEMPLATE_GROUP_STR = "%s/topapi/im/chat/scenegroup/template/apply?access_token=%s"; // post

	public static final String DDAPI_UPDATE_USER_STR = "%s/user/update?access_token=%s";// post
	public static final String DDAPI_DELETE_USER_STR = "%s/user/delete?access_token=%s&userid=%s";// get
	public static final String DDAPI_BATCHDELETE_USER_STR = "%s/user/batchdelete?access_token=%s";// post
	public static final String DDAPI_SIMPLELIST_USER_STR = "user/simplelist?access_token=%s&department_id=%d"; // get
	public static final String DDAPI_GET_ADMIN_USER_STR = "%s/user/get_admin?access_token=%s";// get

	public static final String DDAPI_GET_DEPARTMENT_LIST_STR = "%s/department/list_parent_depts?access_token=%s&userId=%s";

	public static final String DDAPI_GET_PROCESS_INSTANCE_STR = "%s/topapi/processinstance/get?access_token=%s";
	public static final String DDAPI_CREATE_PROCESS_INSTANCE_STR = "%s/topapi/processinstance/create?access_token=%s";

	public static final String DDAPI_UPLOAD_MEDIA_STR = "%s/media/upload?access_token=%s";

}
